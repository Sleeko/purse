import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NguCarouselConfig } from '@ngu/carousel';
import { Observable, interval, BehaviorSubject, Subject } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { Product } from '../../model/product.model';
import { UtilsService } from '../../services/utils.service';
import { Code } from '../../model/code.model';
import { UserInfo } from '../../model/user-info.model';
import { UserService } from '../../services/user.service';
import { stringify } from 'querystring';
import { Upline } from '../../model/upline.model';
import { FeaturedContentService } from '../../services/featured-content.service';
import { FeaturedContent } from '../../model/featured-content.model';


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

  imgags: any[] = [
    {
      photoUrl: "https://picsum.photos/id/237/200/322"
    },
    {
      photoUrl: "https://picsum.photos/id/222/200/312"
    },
    {
      photoUrl: "https://picsum.photos/id/236/200/324"
    },
    {
      photoUrl: "https://picsum.photos/id/235/200/342"
    },
    {
      photoUrl: "https://picsum.photos/id/234/200/325"
    },
    {
      photoUrl: "https://picsum.photos/id/324/200/352"
    },
    {
      photoUrl: "https://picsum.photos/id/232/200/315"
    }
  ];

  test: string[] = ['asdasdasdasdasd', '12312312312312312', 'zxc123zxc123zxcasd123'];
  carouselItems: Observable<FeaturedContent[]>;
  featuredContents: FeaturedContent[] = [];
  registerFormGroup: FormGroup;
  listOfCode: any[];
  isSeller: boolean = true;
  data: any;
  accountResponse: any;

  chamber: any;
  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private authService: AuthService,
    private utilsService: UtilsService,
    public router: Router,
    private featuredContentService: FeaturedContentService) {

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
    this.registerFormGroup = this.formBuilder.group({
      email: [
        '',
        //[Validators.required, Validators.email],
        //this.validateEmail.bind(this)
      ],
      code: [
        '',
        {
          validators: [
            // , this.validateCode.bind(this)
          ],
          updateOn: 'blur'
        }
      ],
      referrerCode: [
        ''
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
      isSeller: [
        1
      ],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      }, { validator: this.passwordConfirming }),
      updateOn: 'blur'
    });
    // console.log(this.registerFormGroup);
    this.registerFormGroup.get('isSeller').valueChanges.subscribe(data => { data === 1 ? this.isSeller = true : this.isSeller = false; });
    // test
    this.utilsService.searchUpline('test').subscribe(e => {
      const response = e.map(obj => ({
        docId: obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as Upline));

      console.log('response-upline', JSON.stringify(response.length));
    });
    this.getFeaturedContents();
  }

  getFeaturedContents() {
    this.featuredContentService.getAllFeaturedContent().subscribe(e => {
      const response = e.map(obj => ({
        docId: obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as FeaturedContent));
      this.featuredContents = response;
    });
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
      return { invalid: true };
    }
  }

  validateCode(control: AbstractControl) {
    // return this.accountService.validateCodeIfExist(control.value).subscribe(res => {
    //   return res ? null : { codeValid: true };
    // });

    // TODO:
    // @christian
    // pre pa uncomment ako nito. for SOLID principle dapat ito nakabind instead
    // na si registerv2 na function tightly coupled si registerV2()
    // another note: dapat magtitrigger lang to during onBlur or lostfocus sa field
    // as of now naka keyUp sya nagtitriggered masyadong expensive si method.
    // - bryana
    //
    var isUsed: boolean = false;
    var isFinished: boolean = false;
    // this.utilsService.validateMembershipCode(control.value).subscribe(res => {
    //   console.log('firestore-response:', res);
    //   return res.isUsed ? { codeValid : true } : null;
    // });

    // this.utilsService.validateMembershipCode(control.value).subscribe(res => {
    //     isValid = res.isUsed;
    // },
    // )
    var code: Code[] = [];
    return this.utilsService.searchCode(control.value).subscribe(e => {
      const response = e.map(obj => ({
        docId: obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as Code));
    
    },
      err => {

      },
      () => {
        return isUsed ? { codeValid : true } : null
      })

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
      referrerCode: formData.referrerCode,
      password: formData.passwords.password,
    };

    const payload = { email: req.email, password: req.password };

    const payloadMCode = {
      docId: 'document id from utils.searchCode',
      code: req.code,
      isUsed: true
    } as Code;

    this.utilsService.updateGeneratedCode(payloadMCode);
    // register via firebase. TODO: add loading screen
    this.tryRegister(payload);
  }

  /**
   *  NOTE:
   *  @todo removed this method once the field validator working properly
   *  @description - this method is tightly coupled
   *  doing all the neccessary steps to validate membershipCode and Referral Code
   */
  registerV2(formData) {
    const req = {
      email: formData.email,
      code: formData.code,
      referrerCode: formData.referrerCode,
      password: formData.passwords.password,
    };

    // 1. check member code if valid
    this.utilsService.searchCode(req.code).subscribe(e => {
      const responseCode = e.map(x => ({
        docId: x.payload.doc.id,
        ...x.payload.doc.data()
      } as Code));

      console.log('search-response', JSON.stringify(responseCode));
      // 1.1 check response
      if (responseCode[0]) {
        // 1.2 if already used
        if (responseCode[0].isUsed) {
          alert('code is already used.');
        } else { // 1.3 if not yet used proceed to next validation: referal code
          const payload = { email: req.email, password: req.password };
          // update member code. marked it as used.

          responseCode[0].isUsed = true;
          this.utilsService.updateGeneratedCode(responseCode[0]);
          // register via firebase. TODO: add loading screen
          this.tryRegister(payload);
        }
      } else {
        alert('Invalid code!');
      }
    });
  }

  // sub-routine method for registration
  tryRegister(payload) {
    this.authService.doRegister(payload)
      .then(res => {
        console.log('Account ID', res.user.uid);
        const userInfoPayload = {
          uid: res.user.uid,
          email: res.user.email,
          personalInfo: {},
          accountInfo: {},
          governmenDocuments: {},
          dateRegistered: new Date()
        };

        this.userService.saveUserInfo(userInfoPayload).then(data => {
          console.log('account creation', data);
        }).catch(error => {
          console.log('error', error);
        });
        //        alert('Your account has been created');
      }, err => {
        console.log(err);
        console.log(err.message);
        alert(err.message);
      });
    console.log('data', this.data);
  }
}


