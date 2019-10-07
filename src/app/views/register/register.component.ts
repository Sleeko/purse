import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Code } from '../model/member.model';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit{

  registerFormGroup: FormGroup;
  listOfCode: Code[];
  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private authService: AuthService,
              public router: Router) { }

  ngOnInit() {
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
      passwords: this.formBuilder.group({
          password: ['', [Validators.required]],
          confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming}),
    });
    console.log(this.registerFormGroup);
    this.authService.getListOfCode().valueChanges().subscribe(e => this.listOfCode = e);
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
