import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  constructor(public authService: AuthService, public router: Router) {
    this.errorText = '';
  }

  ngOnInit() {
  //   if (this.authService.isLoggedIn) {
  //     this._router.navigate(['/apps']);
  //  }
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
}
