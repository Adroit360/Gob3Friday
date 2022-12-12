import { SocketService } from './../services/socket-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  private socket: any;
  constructor(
    private router: Router,
    private socketService: SocketService,
    private http: HttpClient
  ) {
    this.socket = io('https://gob3-friday-api.azurewebsites.net/');
    // this.socket = io('http://localhost:8000/');
  }

  foodArray: any;
  closingTime: string = '';
  currentTime: string = '';
  public orderStatus: boolean = false;
  breakTime: { closingTime: string; openingTime: string } = {
    closingTime: '',
    openingTime: '',
  };
  closingTimeError = false;
  subscription: Subscription = new Subscription();

  headings = [
    'gob3 friday',
    'lorem ipsum',
    'qqqqqqq',
    'dkdkdkdkdkdk',
    'dddddididi',
  ];

  selectedIndex = 0;

  ngOnInit(): void {
    this.http
      .get('https://gob3-friday-api.azurewebsites.net/')
      .subscribe((res: any) => {
        this.orderStatus = res.orderStatus;
        if (this.orderStatus) {
          this.closingTimeError = true;
        } else {
          this.closingTimeError = false;
        }
      });

    this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
      this.orderStatus = res.orderStatus;
      if (res.orderStatus) {
        this.closingTimeError = true;
      } else {
        this.closingTimeError = false;
      }
    });

    this.foodArray = this.socketService.getAllFoods();
    // autoslide items
    setInterval(() => {
      this.onNextItem();
    }, 5000);
  }

  onProceedToOrderPage(id: number): void {
    if (this.orderStatus) {
      this.closingTimeError = true;
    } else {
      this.closingTimeError = false;
      this.router.navigate(['/orders', id]);
    }
  }
  onNextItem() {
    if (this.selectedIndex === this.headings.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex += 1;
    }
  }
}
