import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NguCarouselConfig, NguCarouselStore, NguCarousel } from '@ngu/carousel';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { slider } from './seller.animation'
import { Product } from '../../model/product.model';
import { Router } from '@angular/router';
import { FilterSellerPipe } from '../../utils/pipes/filter-seller.pipe';


@Component({
  templateUrl: 'sellers.component.html',
  providers: [FilterSellerPipe],
  styles: [`
  .has-search .form-control {
    padding-left: 2.375rem;
}

.has-search .form-control-feedback {
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #aaa;
}
    
  `]
})
export class SellersComponent implements OnInit {

  searchSeller: any;
  
  sellers: any[] = [
    {
      name: "Cake Draft Café",
      url: "https://www.facebook.com/CakeDraftProjectCafe/?ref=br_rs",
      photoUrl: "https://scontent.fmnl6-1.fna.fbcdn.net/v/t31.0-8/12244326_501821179996148_6270926810811842371_o.jpg?_nc_cat=101&_nc_eui2=AeG2gpTnScIhm9rakvlF5mcdd1MxPouDCnHzWbx73fqzWlDosk3Ay5dB3IzKM32mWnJ_HeRJX-EOdR9-pzM-X6Ikzq6p8lZ5oiEKFZgHO0rVCA&_nc_oc=AQkpmAdmfSCQnIwae6Qz9AvnEEjEy5r01JNaA6EC4vbQg2eQNJezgecX0rbvNr0ddRo&_nc_ht=scontent.fmnl6-1.fna&oh=1192622de076112f8d558de745e85b20&oe=5E642D05"
    },
    {
      name: "Aling Kika's Food Products",
      url: "https://www.facebook.com/AlingKikasBibingka/?ref=br_rs",
      photoUrl: "https://scontent.fmnl6-2.fna.fbcdn.net/v/t1.0-9/71724486_528826014609761_8430874532641767424_n.png?_nc_cat=109&_nc_eui2=AeHyZ6I5rtNxmmHiady12GzBskrvWfvvzlIFJeHp2YBqlSgje_pY7MgPe6os3HTAx3waWtUMi7Mheyd9zhL_XGcQn8beBGhxe0U2qfa0E_wj8g&_nc_oc=AQkMs9BuI0c-wl4JP13H33N3HOIkgTMlbuP4CPnmw46qvqjIvT1YtaQXAh0km9CIzo0&_nc_ht=scontent.fmnl6-2.fna&oh=43257988c362955c5e020e1461dad88f&oe=5E54DABF"
    },
    {
      name: "Siomai Express",
      url: "https://www.facebook.com/siomaiXpress/?ref=br_rs",
      photoUrl: "https://scontent.fmnl6-2.fna.fbcdn.net/v/t1.0-9/44186012_245718409442854_6078956823673569280_n.jpg?_nc_cat=106&_nc_eui2=AeENtjikWiyuQSrnNKwpzignKum7h9OZKxs7rIwn0p3betVWaf9t5lFcjYU1xeuj8kd1nziGuwJqvf6mOc8BWrEB5AnEQfqoxe78Xs2_muZxqQ&_nc_oc=AQn0ax4-dm5r13ma1YSHvhmc_3UIuZLPfc5IEhw-4eNqmehJVnBQ6xUnDpzbQRsYp0M&_nc_ht=scontent.fmnl6-2.fna&oh=df4614adb219c2c6dc2a009714510a7b&oe=5E176C7C"
    },
    {
      name: "Dried Fish/Chorizo/Tocino Cebu Supplier",
      url: "https://www.facebook.com/Dried-FishChorizoTocino-Cebu-Supplier-711270855916553/?ref=br_rs",
      photoUrl: "https://scontent.fmnl6-1.fna.fbcdn.net/v/t1.0-9/51982156_784458981931073_5580375218699894784_n.jpg?_nc_cat=107&_nc_eui2=AeHVJGMwS29c1V1T5551OJYTG6ewFvI9EYeb1KWXL6uTM5_f1rQuJgCYR_OvqUlM9TYE4-ln2Bjt8NV59uToJYg45XhLFkvdfwNb2oHQKVB_5w&_nc_oc=AQl6Xt0Ur8uzIE4DLsyiUdhQTn0eDraPd5Jrn1PPr1YWYsBV3zQHYJBJQ83DEJDjCHE&_nc_ht=scontent.fmnl6-1.fna&oh=f24a4885fc0523ef9256fcee85760c0d&oe=5E645BD9"
    },
    {
      name: "Mi Philippines Buy and Sell",
      url: "https://www.facebook.com/marketplace/item/402497550445575/",
      photoUrl: "https://scontent.fmnl6-2.fna.fbcdn.net/v/t1.0-9/74162363_2743099862401968_3928144155112374272_n.jpg?_nc_cat=104&_nc_eui2=AeG-VXgIPIFvTB53xwJVN2Gq-B4ZbjMpLEwXlU8pHYO6SaqeNSDbsBOX_WJvEhQ-IEooRY1mMYLacWYRA-z-SpVOT6wMJ1bnYVAE0oaKK6g6LQ&_nc_oc=AQnzUYJn4_JJ2lAumtY4G5mDkZjtYqiPpPNnBSquiMdO_x16GTgpO0FAP0bbTe1BOAg&_nc_ht=scontent.fmnl6-2.fna&oh=90b71589654610e95724573bef0d645b&oe=5E6258D2"
    },
    {
      name: "For Sale: Mixer & Controller",
      url: "https://www.facebook.com/marketplace/item/2893453397378809/",
      photoUrl: "https://scontent.fmnl6-2.fna.fbcdn.net/v/t1.0-9/70930221_1409645429186884_6993652791772184576_n.jpg?_nc_cat=104&_nc_eui2=AeGRMKwRPGGX4kcFfd7qKqS72KtHhILHCwzTUGdND5gsXFyQz251N5hxvpV4aNUGMgA_uErlxaKGSKvHTbL0AWk6gSuomVu_2ARbBvaJWH68wg&_nc_oc=AQnXdLd6fTdaoBU-Vey5_k87tMnfTCPHMnlVeyyhz_0zW4YTOw7vgIFIguZOQxVx60M&_nc_ht=scontent.fmnl6-2.fna&oh=2eb8d11d6f04deb30240a02c57bb3553&oe=5E5AE38E"
    },
    {
      name: "BUY AND SELL UNITED",
      url: "https://www.facebook.com/marketplace/item/2374658849479103/",
      photoUrl: "https://scontent.fmnl6-1.fna.fbcdn.net/v/t1.0-9/28576728_1843828399021721_764528428286059805_n.jpg?_nc_cat=105&_nc_eui2=AeFrjE2XsV8tbPmgEvgh_PR5vXcN_0LfwPAdSLsgKc9vXYAB7SfGGA0661aRu7p7r5qJ2WPuxEutaGp9z-_EhzHMqvKsO_0zt8nI15dCjPGoHg&_nc_oc=AQmtCcq77J5uMJFcgUtt7LTHnXu-waQQ_-RVynm9Zg5-cEr_t83ue7V__fqSKuqAoX8&_nc_ht=scontent.fmnl6-1.fna&oh=647d5b89a7e34a01ce5c5a1a94f899f1&oe=5E5F7D52"
    },
    {
      name: "Chocolate Republic",
      url: "https://www.facebook.com/ChocoRepublic01/?ref=br_rs",
      photoUrl: "https://scontent.fmnl6-1.fna.fbcdn.net/v/t1.0-9/71498425_2401899119925406_4884764166570639360_o.jpg?_nc_cat=103&_nc_eui2=AeGNRu5kuMGjVnf-Blqowwy9eEZ8tFAUgQ4hTuXt95ACFdoxcwl52CAsW_a0rmdYZBzJfo74WEU320Z68_ROqwWkfqEddh72gFNlumb7neuktA&_nc_oc=AQkdtdD0liN-wxAGTGlFQcZ9Gm7rMIXr8r106EJJQWr4xRnAlz-dpSH79HzZWSDyfl8&_nc_ht=scontent.fmnl6-1.fna&oh=6e795ab5b1bb9811c1abc90def98f582&oe=5E1DBED6"
    },


    
  ];

  ngOnInit(): void {
    
  }

  constructor(private router: Router, private filterSellerPipe: FilterSellerPipe){
  }


  openUrl(url: string) {
    window.open(url, "_blank");
  }

 
}