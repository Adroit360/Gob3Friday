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
      body: 'Gob3 small pack',
      image: '../../assets/standardPack.jpeg',
      alt: 'Beans with plantain(Mini size)',
      price: '25.00',
    },
    {
      id: '3646754e10574da3a16a90e2ecff5e06',
      body: 'Gob3 standard pack(Full size)',
      image: '../../assets/gob3StandardPackFull.jpeg',
      alt: 'Gob3 standard pack(Full size)',
      price: '30.00',
    },
    {
      id: '4d2da93389ce48aa8841c56891494942',
      body: 'Gob3 Jumbo Pack. Contains Standard Pack, Extra Plantain, Egg & Pepper ,Pear ,Gizzard,Chicken/Fish',
      image: '../../assets/jumboPack.jpeg',
      alt: 'Jumbo pack',
      price: '50.00',
    },
    {
      id: '4226d4f1e91e404880345bc18be88e5b',
      body: 'Gob3 Premium Pack. Contains Standard Pack, Extra Plantain ,Egg & Pepper ,Pear ,Gizzard ,Chicken/Fish ,*Priority Service',
      image: '../../assets/fullSize.jpeg',
      alt: 'gob3 premium pack',
      price: '60.00',
    },

    {
      id: 'c92a574c98634a70998b71d110f51fd5',
      body: 'Aboboi & Tatale (5Pcs)',
      image: '../../assets/newAboboi.jpeg',
      alt: 'Aboboi & Tatale (5Pcs)',
      price: '35.00',
    },
    {
      id: 'ddbf19c31b9c4844865bf59fbb8fc987',
      body: 'with extra plantain',
      image: '../../assets/plantain.jpeg',
      alt: 'plantain',
      price: '5.00',
    },
    {
      id: 'ddbf19c31b9c4844865bf59fbb8fc985',
      body: 'with egg',
      image: '../../assets/withEgg.jpeg',
      alt: 'with egg',
      price: '2.00',
    },
    {
      id: 'ddbf19c31b9c4844865bf59fbb8fc986',
      body: 'with pear',
      image: '../../assets/pear.png',
      alt: 'pear',
      price: '5.00',
    },
    {
      id: 'ab62ad68aff443afa4c827a78a22e3a3',
      body: 'with fish',
      image: '../../assets/withFish.jpeg',
      alt: 'with fish',
      price: '10.00',
    },
    {
      id: '6fe15e03186f478b8c2399ae70a51960',
      body: 'with chicken',
      image: '../../assets/withChicken.jpeg',
      alt: 'with chicken',
      price: '8.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598847',
      body: 'with gizzard',
      image: '../../assets/withGizzard.jpeg',
      alt: 'with gizzard',
      price: '8.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598848',
      body: 'with yam chips',
      image: '../../assets/Yam-Chips.jpg',
      alt: 'with yam chips',
      price: '7.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598849',
      body: 'with tatale',
      image: '../../assets/tatale.jpeg',
      alt: 'with tatale',
      price: '4.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598850',
      body: 'with pepper',
      image: '../../assets/pepper.jpg',
      alt: 'with pepper',
      price: '1.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598851',
      body: 'with gari',
      image: '../../assets/Garri.jpg',
      alt: 'with gari',
      price: '1.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598855',
      body: 'with rice',
      image: '../../assets/rice.jpeg',
      alt: 'with rice',
      price: '7.00',
    },
    {
      id: '91fcca31cba046fea468af2c659bcf86',
      body: '3tor (mini pack)',
      image: '../../assets/etorMiniPack.jpeg',
      alt: '3tor (mini pack)',
      price: '40.00',
    },
    {
      id: 'b29a20e95dc64369b225355c8f696c21',
      body: '3tor in Ayewa',
      image: '../../assets/EtorInAyewa.jpeg',
      alt: '3tor in Ayewa',
      price: '80.00',
    },
    {
      id: '596e88701eaf40e6aedb4fb1c5753e4e',
      body: '3tor cake(1 tier)',
      image: '../../assets/gob3Cake.jpeg',
      alt: '3tor in Ayewa',
      price: '370.00',
    },
    {
      id: '99a22ef88cc44fffa947d0fc16cccee1',
      body: '3tor cake 2 tier',
      image: '../../assets/gob3Cake.jpeg',
      alt: '3tor in Ayewa',
      price: '600.00',
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
