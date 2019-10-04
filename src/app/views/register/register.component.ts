import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit{

  registerFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private authService: AuthService,
              public router: Router) { }

  ngOnInit() {
    this.registerFormGroup = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
        this.validateEmail.bind(this)
      ],
      code: [
        '',
        [Validators.required],
        this.validateCode.bind(this)
      ],
      passwords: this.formBuilder.group({
          password: ['', [Validators.required]],
          confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming}),
    });
    console.log(this.registerFormGroup);
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

  register() {
    let req = {
      email: this.registerFormGroup.controls['email'].value,
      code: this.registerFormGroup.controls['code'].value,
      password: this.registerFormGroup.controls['password'].value,
    }

    this.accountService.register(req).subscribe(
      data=> {
          if (this.authService.login(data)) {
            this.router.navigate(['/dashboard']);
          }
      },
      err=> {

      },
      ()=> {

      }
    )
  }

}
