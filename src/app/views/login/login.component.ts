import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../model/user-info.model';
import { AppConstants } from '../../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  public errorText: string;
  currentUser: UserInfo = new UserInfo();
  loginForm: FormGroup;

  constructor(public authService: AuthService,
    public router: Router,
    private userService: UserService,
    private fb: FormBuilder) {
    this.errorText = '';
    this.createForm();
  }
  data: any[];
  ngOnInit() { }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  navigateUserByRole(user: any) {
    if (user.role == AppConstants.ADMIN) {
      this.router.navigate(['/admin-dashboard']);
    } else if (user.role == AppConstants.MEMBER) {
      this.router.navigate(['/dashboard']);
    } else if (user.role == AppConstants.SELLER) {
      this.router.navigate(['/account-settings']);
    }
  }

  tryLogin(value) {
    console.log(value);
    this.authService.login(value).subscribe(res => {
      const user = {
        role: res.userData.accountType
      }
      this.navigateUserByRole(user);
    });
  }
  
}
