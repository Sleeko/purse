import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NguCarouselConfig, NguCarouselStore, NguCarousel } from '@ngu/carousel';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { slider } from './seller.animation'
import { Product } from '../../model/product.model';

@Component({
  templateUrl: 'sellers.component.html',
  styles: [`

    h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
    .product-style {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-size: 0.9rem;
    }
    .text-purse {
      color: #20853b;
    }
    
  `]
})
export class SellersComponent implements OnInit {
  imgags: any[] = [
    {
      name: "Rice 1 Sack",
      price: 1200,
      photoUrl: "https://ph-test-11.slatic.net/p/74051f2d619ce66bd578ae226fb772dd.jpg"
    },
    {
      name: "Flour 100 gram",
      price: 300,
      photoUrl: "https://ph-test-11.slatic.net/p/9435dca2a5076718bde6b941e225dc79.jpg"
    },
    {
      name: "Sugar 100 gram",
      price: 200,
      photoUrl: "https://ph-test-11.slatic.net/p/093c396396e93a2474c7b9c634ce882d.jpg"
    },
    {
      name: "Salt 100 gram",
      price: 100,
      photoUrl: "https://ph-test-11.slatic.net/p/395754f51ab30a672040e842fb7b8bd5.jpg"
    },
    {
      name: "Cooking Coil 2.84L",
      price: 497,
      photoUrl: "https://ph-live-01.slatic.net/original/3638b840c19207f8fbb0a02b144534ce.jpg"
    },
    {
      name: "Tucino 150grams",
      price: 35,
      photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ276bpGthCbdY4SfUg--nnMEpCSkmyXqWGT8xKj4eYnq7ZFcP3"
    },
    {
      name: "Embutido 150grams",
      price: 35,
      photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ9ZzfzR2z-KWJKG50IyNg_uL8_aqS-RSwQYAWDbKDAX4496Jrp"
    }
  ];

  imgags2: any[] = [
    {
      name: "Atsara 1 jar",
      price: 270,
      photoUrl: "https://ph-live-01.slatic.net/original/2ddf3262631191ea84b5ffb57b5df89c.jpg"
    },
    {
      name: "Dried Fish/Tuyo",
      price: 75,
      photoUrl: "https://ph-test-11.slatic.net/p/d1738f5ea12360ed436b5b7873a1c02c.jpg"
    },
    {
      name: "Premium Strawberry Jam 16oz Set of 2",
      price: 549,
      photoUrl: "https://ph-test-11.slatic.net/p/12/premium-strawberry-jam-16oz-set-of-2-9369-59592331-e8e552d14ae6c845141d90fcea4747ea-catalog_233.jpg"
    },
    {
      name: "Banana Chips with Honey 500g",
      price: 399,
      photoUrl: "https://ph-test-11.slatic.net/p/7c79af41b101df0a7d6a1d0805672f80.jpg"
    },
    {
      name: "Jumbo Lucban longanisa (450grams, 6 pcs)",
      price: 250,
      photoUrl: "https://ph-test-11.slatic.net/p/7d2ca9f52e0313d312940a7c9dc84a57.jpg"
    },
    {
      name: "Aaleyah's Smooth Peanut Butter 600g (BIG)",
      price: 135,
      photoUrl: "https://ph-test-11.slatic.net/p/4450e7b49fa4808340e704f68e7cbe81.jpg"
    }
    // {
    //   name: "Embutido 150grams",
    //   price: 35,
    //   photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ9ZzfzR2z-KWJKG50IyNg_uL8_aqS-RSwQYAWDbKDAX4496Jrp"
    // }
  ];


  @Input() name: string;
  public carouselTileItems$: Observable<Product[]>;
  public carouselTileItems2$: Observable<Product[]>;
  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 5, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 1500 },
    animation: 'lazy'
  };
  tempData: any[];
  
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.tempData = [];
    this.carouselTileItems$ = interval(500).pipe(
      startWith(-1),
      take(10),
      map(val => {
        let i=0;
        const data = this.imgags;
        return data;
      })
    );
    this.carouselTileItems2$ = interval(500).pipe(
      startWith(-1),
      take(10),
      map(val => {
        let i=0;
        const data = this.imgags2;
        return data;
      })
    );
  }

     // carou
}