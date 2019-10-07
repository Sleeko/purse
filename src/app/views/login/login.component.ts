import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  postData = {
    email: 'aadsd',
    password: 'dsd'
  };

  email: string;
  password: string;
  public errorText: string;

  loginForm: FormGroup;

  constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
    this.errorText = '';
    this.createForm();
  }

  ngOnInit() {
  //   if (this.authService.isLoggedIn) {
  //     this._router.navigate(['/apps']);
  //  }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginAction() {
    if (this.postData.email && this.postData.password) {
      if (this.authService.login(this.postData)) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.errorText = 'Please give valid data';
    }
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log(err);
        alert(err.message);
      });
  }
}
