import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NguCarouselConfig } from '@ngu/carousel';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styles : [
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

    `
  ]
})
export class RegisterComponent implements OnInit {

  // carouselConfig: NguCarouselConfig = {
  //   grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
  //   load: 3,
  //   interval: {timing: 4000, initialDelay: 1000},
  //   loop: true,
  //   touch: true,
  //   velocity: 0.2
  // }

  // test : string[] = ['1','2','3'];
  // carouselItems : Observable<String[]>;
  registerFormGroup: FormGroup;
  listOfCode: any[];
  isSeller : boolean = false;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private authService: AuthService,
              public router: Router) { }

  ngOnInit() {
    // this.carouselItems = interval(500).pipe(
    //   startWith(-1),
    //   take(10),
    //   map(val => {
    //     let i=0;
    //     const data = this.test;
    //     return data;
    //   })
    // );
    
    this.registerFormGroup = this.formBuilder.group({
      email: [
        '',
        //[Validators.required, Validators.email],
        //this.validateEmail.bind(this)
      ],
      code: [
        '',
        //[Validators.required],
        //this.validateCode.bind(this)
      ],
      referrerCode : [
        ''
      ],
      sellerName:[
        ''       
      ],
      contactNumber : [
        null
      ],
      sellerUrl : [
        ''
      ],
      isSeller : [
        1
      ],
      passwords: this.formBuilder.group({
          password: ['', [Validators.required]],
          confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming}),
    });
    console.log(this.registerFormGroup);
    this.authService.getListOfCode().valueChanges().subscribe(e => this.listOfCode = e);
    this.registerFormGroup.get('isSeller').valueChanges.subscribe(data => { data == 1 ? this.isSeller = true : this.isSeller = false });
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
      if (c.get('password').value !== c.get('confirm_password').value) {
          return {invalid: true};
      }
  }

  validateCode(control: AbstractControl) {
    return this.accountService.validateCodeIfExist(control.value).subscribe(res => {
      return res ? null : { codeValid: true };
    });
  }

  validateEmail(control: AbstractControl) {
    return this.accountService.validateEmailNotTaken(control.value).subscribe(res => {
      return res ? null : { emailTaken: true };
    });
  }

  register(formData) {
    console.log('formData', JSON.stringify(formData));
    const req = {
      email: formData.email,
      code: formData.code,
      referrerCode : formData.referrerCode,
      password: formData.passwords.password,
    };

    const result = this.listOfCode.find(obj => obj.code === req.code);
    if (result && result.isUsed) {
      console.log('code is already used.');
      alert('code is already used.');
    } else if (result && !result.isUsed) {
        const payload = {
          email: req.email,
          password: req.password
        };
        this.tryRegister(payload);
        // TODO: @bryan
        // after successfully creating an account, update the validation code status 'isUsed' into true.
        // clear the form fields and redirect it into login page.
    } else {
      console.log('code is invalid.');
      alert('Invalid code!');
    }
  }

  // sub-routine method for registration
  tryRegister(payload) {
    this.authService.doRegister(payload)
      .then(res => {
        console.log(res);
        console.log('Your account has been created');
        alert('Your account has been created');
      }, err => {
        console.log(err);
        console.log(err.message);
        alert(err.message);
      });
  }

 
  

}
