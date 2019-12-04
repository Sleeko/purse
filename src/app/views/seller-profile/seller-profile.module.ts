import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerProfileRoutingModule } from './seller-profile-routing.module';
import { SellerProfileComponent } from './seller-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';



@NgModule({
  declarations: [SellerProfileComponent],
  imports: [
    CommonModule,
    SellerProfileRoutingModule,
    ReactiveFormsModule,
    TabMenuModule,
  ],
  exports:[SellerProfileComponent],

})
export class SellerProfileModule { }
