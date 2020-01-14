import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NguCarouselConfig } from '@ngu/carousel';
import { Observable, interval, Subject } from 'rxjs';
import { startWith, take, map, debounceTime } from 'rxjs/operators';
import { FeaturedContentService } from '../../services/featured-content.service';
import { FeaturedContent } from '../../model/featured-content.model';
import { AccountService } from '../../services/account.service';
import { AlertService } from 'ngx-alerts';
import { GrowlService } from 'ngx-growl';
import { AdvGrowlService } from 'primeng-advanced-growl';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styles: [
    ` h1{
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
    input[type=radio] {
      height: 1.2em;
  }

  input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

    `
  ]
})
export class RegisterComponent implements OnInit {

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 3, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 1500 },
    animation: 'lazy'
  };

  featuredContents: FeaturedContent[] = [];
  carouselItems: Observable<FeaturedContent[]>;
  registerFormGroup: FormGroup;
  sellerFormGroup: FormGroup;
  registerLoading: boolean = false;
  isDuplicateEmail: boolean = false;
  isDuplicateMemberCode: boolean = false;
  isInvalidUplineCode : boolean = false;

  isSeller = 1;
  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private featuredContentService: FeaturedContentService,
    private growlService: AdvGrowlService,
    private spinnerService : NgxSpinnerService,
    public router: Router) {
  }

  ngOnInit() {
    this.carouselItems = interval(500).pipe(
      startWith(-1),
      take(10),
      map(val => {
        const i = 0;
        const data = this.featuredContents;
        return data;
      })
    );
    this.buildSellerForm();
    this.getFeaturedContents();
    this.registerFormGroup = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      code: [
        '',
        [Validators.required],
        //[this.searchCodeValidator()]
      ],
      referrerCode: [
        '',
        [Validators.required],
        //[this.searchUplineValidator()]
      ],
      sellerName: [
        ''
      ],
      contactNumber: [
        null
      ],
      sellerUrl: [
        ''
      ],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      }, { validator: this.passwordConfirming })
    });
  }

  buildSellerForm() {
    this.sellerFormGroup = this.formBuilder.group({
      // sellerName : ['', [Validators.required]],
      // contactNumber : ['',[Validators.required,Validators.maxLength(10), Validators.minLength(10)]],
      // sellerUrl : ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      }, { validator: this.passwordConfirming })
    })
  }

  /**
   * 
   */
  getFeaturedContents(){
    this.featuredContentService.getAllFeaturedContent().subscribe(
      data => {
        console.log('Featured' ,data)
        this.featuredContents = data;
    });
  }

  validateEmail(email) {
    this.accountService.validateEmail(email).subscribe(data => {
      if (data.used) {
        this.isDuplicateEmail = true;
        this.sellerFormGroup.controls['email'].setErrors({ isDuplicateEmail: true });
        this.registerFormGroup.controls['email'].setErrors({ isDuplicateEmail: true });
      } else {
        this.isDuplicateEmail = false;
        this.sellerFormGroup.controls['email'].setErrors(null);
        this.registerFormGroup.controls['email'].setErrors(null);
      }
    },
      err => {
        this.sellerFormGroup.controls['email'].setErrors({ isDuplicateEmail: true });
        this.registerFormGroup.controls['email'].setErrors({ isDuplicateEmail: true });
        this.isDuplicateEmail = true;
      });
  }

  validateMemberCode(memberCode) {
    this.accountService.validateCode(memberCode).subscribe(data => {
      console.log(data)
      if (data.used) {
        this.isDuplicateMemberCode = true;
        this.registerFormGroup.controls['code'].setErrors({ isDuplicateMemberCode: true });
      } else {
        this.isDuplicateMemberCode = false;
        this.registerFormGroup.controls['code'].setErrors(null);
      }
    },
      err => {
        this.isDuplicateMemberCode = true;
        this.registerFormGroup.controls['code'].setErrors({ isDuplicateMemberCode: true });
      },
      () => {

      }
    );
  }

  validateUplineCode(uplineCode) {
    this.accountService.validateUplineCode(uplineCode).subscribe(data => {
      console.log(data)
      if (!data.used) {
        this.isInvalidUplineCode = true;
        this.registerFormGroup.controls['referrerCode'].setErrors({ isInvalidUplineCode: true });
      } else {
        this.isInvalidUplineCode = false;
        this.registerFormGroup.controls['referrerCode'].setErrors(null);
      }
    },
      err => {
        this.isInvalidUplineCode = true;
        this.registerFormGroup.controls['referrerCode'].setErrors({ isInvalidUplineCode: true });
      },
      () => {

      }
    );
  }

  searchCodeValidator() {
  }

  searchUplineValidator() {
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
      return { invalid: true };
    }
  }

  /**
   * @author Bryan
   * @method register interface for saving user information, it handles all the service call and data inputs,
   *                  data validation must visible here
   * @param formData form data from registration form
   */
  register(formData) {
    const payload = {
      email: formData.email,
      password: formData.passwords.password,
      memberCode: formData.code,
      uplineCode: formData.referrerCode,
      accountType: 'MEMBER'
    };
    this.doRegisterUser(payload);
  }

  registerSeller(formData) {
    const payload = {
      email: formData.email,
      password: formData.passwords.password,
      memberCode: '000000',
      uplineCode: '000000',
      accountType: 'SELLER'
    };

    this.doRegisterSeller(payload);
  }

  /**
   * @author Bryan
   * @method tryRegister service implementation of registration, it served as the business functionality
   *                     for saving user information and handling the movement of the virtual chamber
   * @param payload form data that contain vital user information
   * @param req request data for referrer code (upline code)
   */
  doRegisterUser(payload) {
    this.spinnerService.show()
    this.registerLoading = true;
    this.accountService.register(payload).subscribe(
      res => {
        if (res.httpStatus == 'BAD_REQUEST') {
          this.growlService.createTimedErrorMessage(res.message, 'Error', 5000);
        } else if (res.httpStatus == 'CREATED') {
          this.growlService.createTimedSuccessMessage(res.message, 'Success', 5000);
        }
      },
      err => {
        this.growlService.createErrorMessage('Error', 'Register Failed');
      },
      () => {
        this.registerLoading = false;
        this.spinnerService.hide();
      }
    );
  }



  doRegisterSeller(payload) {
    this.accountService.register(payload);
  }

}

export class Featured {
  photoUrl: string;
}
