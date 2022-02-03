import { Injectable } from '@angular/core';
import { Food } from '../models/interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  orderStatusEvent: Subject<boolean> = new Subject<boolean>();
  constructor() {}
  closingTime: string = '19:00:00';
  openingTime = '07:00:00';
  foodArray: Food[] = [
    {
      id: '33cc84aebc4b49b9bdc181782680c493',
      body: 'Gob3 standard pack',
      image: '../../assets/standardPack.jpeg',
      alt: 'Beans with plantain(Mini size)',
      price: '15.00',
    },
    {
      id: '3646754e10574da3a16a90e2ecff5e06',
      body: 'Gob3 standard pack(Full size)',
      image: '../../assets/gob3StandardPackFull.jpeg',
      alt: 'Gob3 standard pack(Full size)',
      price: '20.00',
    },
    {
      id: '4226d4f1e91e404880345bc18be88e5b',
      body: 'gob3 premium pack',
      image: '../../assets/fullSize.jpeg',
      alt: 'gob3 premium pack',
      price: '40.00',
    },
    {
      id: 'ab62ad68aff443afa4c827a78a22e3a3',
      body: 'gob3 with fish',
      image: '../../assets/fullSize.jpeg',
      alt: 'gob3 with fish',
      price: '23.00',
    },
    {
      id: '6fe15e03186f478b8c2399ae70a51960',
      body: 'gob3 with chicken',
      image: '../../assets/fullSize.jpeg',
      alt: 'Beans and rice with plantain and egg',
      price: '23.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598847',
      body: 'Beans and rice with plantain, egg and chicken',
      image: '../../assets/BeansWithEggAndChicken.jpg',
      alt: 'Beans and rice with plantain, egg and chicken',
      price: '30.00',
    },
    {
      id: 'ddbf19c31b9c4844865bf59fbb8fc985',
      body: 'Beans and rice with plantain, egg and meat',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans and rice with plantain, egg and meat',
      price: '30.00',
    },
    {
      id: '4d2da93389ce48aa8841c56891494942',
      body: 'Beans and rice with plantain, egg and fish',
      image: '../../assets/riceWithFishAndEgg.jpg',
      alt: 'Beans and rice with plantain, egg and fish',
      price: '30.00',
    },
    {
      id: '91fcca31cba046fea468af2c659bcf86',
      body: 'Beans and rice with plantain, egg, fish and meat',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans and rice with plantain, egg, fish and meat',
      price: '35.00',
    },
  ];

  getFoodByID(id: string): Food {
    return this.foodArray.filter((item) => item.id === id)[0];
  }

  getAllFoods(): Food[] {
    return this.foodArray;
  }

  getClosingTime(): { closingTime: string; openingTime: string } {
    return { closingTime: this.closingTime, openingTime: this.openingTime };
  }
}
