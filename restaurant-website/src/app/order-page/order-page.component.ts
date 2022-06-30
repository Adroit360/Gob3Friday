import { OrderDetails } from './../models/interface';
import { SocketService } from './../services/socket-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { io } from 'socket.io-client';
import { PaymentResponse, Order, Food } from '../models/interface';
import { v4 as uuidv4 } from 'uuid';
import { cities } from '../models/accra';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  addAnotherItemModal: boolean = false;
  foodsOrdered: {
    id: string;
    foodName: string;
    quantity: number;
    price: number;
  }[] = [];
  foodArray: any[] = [];
  payStackUrl: any;
  payStackModal = false;
  showLocation = true;
  invalidLocation = false;
  isValidLocationOrPacks = false;
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private socketService: SocketService,
    private route: ActivatedRoute,
    public domSanitizer: DomSanitizer
  ) {
    this.socket = io('https://gob3-friday-api.azurewebsites.net/');
    // this.socket = io('http://localhost:8000/');
    this.foodArray = this.socketService.getAllFoods();
  }

  orderForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+233\d{9}|^233\d{9}|^\d{10}$/),
    ]),
    location: new FormControl('', Validators.required),
    // deliveryFee: new FormControl(''),
    // amount: new FormControl(0, Validators.required),
    deliveryType: new FormControl('dispatch-rider', Validators.required),
    numberOfPacks: new FormControl('', Validators.required),
    note: new FormControl(''),
    foodOrdered: new FormControl('', Validators.required),
    robot: new FormControl(''),
  });

  orderDetails: any;
  private socket: any;
  public data: any;
  modalOpen = false;

  url = 'https://gob3-friday-api.azurewebsites.net/paystack/payment';
  // url = 'http://localhost:8000/paystack/payment';

  paymentError = true;
  paymentSuccess = false;
  submitted = false;
  paymentLoading = false;
  price = '';
  locations: { name: string; price: number }[] = cities;
  errorMessage = '';
  priceOfFood = '';
  deliveryFee = 0;
  totalPrice = 0;
  clientTransactionId = '';
  deliveryType = 'dispatch-rider';

  ngOnInit(): void {
    window.scroll(0, 0);
    this.route.paramMap.subscribe((params) => {
      const id: any = params.get('id');
      const data: Food = this.socketService.getFoodByID(id);
      this.price = data.price;
      this.priceOfFood = data.price;
      this.orderForm.patchValue({
        amount: data.price,
        foodOrdered: data.body,
        deliveryType: this.deliveryType,
      });
      this.foodsOrdered.push({
        id,
        foodName: data.body,
        quantity: 1,
        price: +data.price,
      });
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.orderForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    const uuid = uuidv4().split('-').slice(0, 2).join('');
    this.clientTransactionId = uuid;

    const isfoodsOrderedValid = this.foodsOrdered.filter(
      (food) => !food.quantity
    );

    if (isfoodsOrderedValid.length > 0) {
      this.isValidLocationOrPacks = true;
      this.errorMessage =
        'Please select the number of packs for each food item';
      this.orderForm.setErrors({ invalid: true });
      return;
    }

    if (this.orderForm.value.robot) {
      return;
    }

    if (
      (this.invalidLocation || this.f['location'].errors) &&
      this.showLocation
    ) {
      this.isValidLocationOrPacks = true;
      this.errorMessage = 'Please select a valid location';
      return;
    }

    if ((this.orderForm.invalid || this.invalidLocation) && this.showLocation) {
      return;
    }

    // set the orderDetails
    this.orderDetails = {
      date: Date.now().toString(),
      orderId: this.clientTransactionId,
      name: this.orderForm.value.name,
      foodOrdered: this.foodsOrdered.map((food) => food.foodName),
      phoneNumber: this.orderForm.value.phoneNumber,
      amount: this.totalPrice,
      note: this.orderForm.value.note,
      completed: false,
      location:
        this.orderForm.value.deliveryType === 'pick-up'
          ? 'Pick Up'
          : this.orderForm.value.location,
      deliveryType: this.orderForm.value.deliveryType,
      deliveryFee:
        this.orderForm.value.deliveryType === 'pick-up' ? 0 : this.deliveryFee,
      priceOfFood: this.priceOfFood,
      orderPaid: false,
      numberOfPacks: this.foodsOrdered.map((food) => ({
        [food.foodName]: food.quantity,
      })),
    };

    let valError = this.validateOrder(this.orderDetails);
    if (valError) {
      this.isValidLocationOrPacks = true;
      this.errorMessage = valError;
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const body = {
      amount: this.totalPrice * 100,
      // amount: 0.01 * 100,
      clientId: this.clientTransactionId,
      orderDetails: this.orderDetails,
    };

    this.paymentLoading = true;
    this.http
      .post<PaymentResponse>(this.url, body, httpOptions)
      .subscribe((res: any) => {
        this.paymentLoading = false;
        if (res.error) {
          console.log(res.error);
          return;
        }
        this.payStackUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          res.auth_url
        );
        this.payStackModal = true;
      });
  }

  validateOrder(orderDetails: OrderDetails) {
    if (orderDetails.foodOrdered.length == 0) {
      return 'Please select at least one food item';
    }

    let invalidNumberOfPacks = Object.keys(orderDetails.numberOfPacks).filter(
      (i) => {
        !orderDetails.numberOfPacks[i];
      }
    );
    if (invalidNumberOfPacks.length > 0) {
      return 'Please select the number of packs for each food item';
    }
    return false;
  }

  validateFoodItem(foodItem: any) {}

  onClose(): void {
    this.paymentError = false;
  }

  calculateAmount(event: any) {
    let foodsPrice = 0;
    this.foodsOrdered.forEach((food) => {
      foodsPrice += Number(food.price * +food.quantity);
    });
    this.priceOfFood = foodsPrice.toFixed(2);
    // if (this.deliveryFee)
    this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);

    // console.log('foodsOrdered', this.foodsOrdered, foodsPrice);
    return;
  }

  onCalculateFee(event: any): void {
    let selectedLocation: any;
    if (event.target) {
      selectedLocation = event.target.value;
    } else {
      selectedLocation = event;
    }

    const city: { name: string; price: number } | undefined =
      this.locations.find((item) => item.name === selectedLocation);

    if (!city) {
      this.invalidLocation = true;
      this.deliveryFee = 0;
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    } else {
      this.invalidLocation = false;
      this.deliveryFee = city.price;
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    }
  }

  getTotalPrice(deliveryFee: number, priceOfFood: string): number {
    return deliveryFee + parseInt(priceOfFood);
    // return 0.01;
  }
  onCloseModal(): void {
    this.payStackModal = false;
    this.router.navigate(['/']);
  }

  addAnotherItem() {
    let foodOrderedIds = this.foodsOrdered.map((i) => i.id);
    this.foodArray = this.socketService
      .getAllFoods()
      .filter((i) => !foodOrderedIds.includes(i.id));
    this.addAnotherItemModal = true;
  }

  closeAddAnotherItemModal() {
    this.addAnotherItemModal = false;
  }

  addFood(id: string): void {
    const data: Food = this.socketService.getFoodByID(id);
    this.foodsOrdered.push({
      id,
      foodName: data.body,
      quantity: 1,
      price: +data.price,
    });

    this.priceOfFood = this.foodsOrdered
      .reduce(function (sum, food) {
        const updatedSum = sum + food.price;
        return updatedSum;
      }, 0)
      .toFixed(2);

    this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);

    this.closeAddAnotherItemModal();
  }

  removeFood(id: string): void {
    this.foodsOrdered = this.foodsOrdered.filter((item) => item.id !== id);
    this.priceOfFood = this.foodsOrdered
      .reduce(function (sum, food) {
        const updatedSum = sum + food.price * food.quantity;
        return updatedSum;
      }, 0)
      .toFixed(2);

    this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
  }

  onDeliveryTypeChange(event: any) {
    if (event.target.value === 'pick-up') {
      this.showLocation = false;
      this.deliveryFee = 0;
      this.calculateAmount(event);
    } else {
      this.showLocation = true;
      if (this.orderForm.value.location) {
        this.onCalculateFee(this.orderForm.value.location);
      }
    }
  }
  onCloseLocationModal() {
    window.scroll(0, 0);
    this.isValidLocationOrPacks = false;
  }
}
