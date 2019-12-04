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

  navigateUserByRole(user: UserInfo) {
    if (user.role == AppConstants.ADMIN) {
      this.router.navigate(['/admin-dashboard']);
    } else if (user.role == AppConstants.MEMBER) {
      this.router.navigate(['/dashboard']);
    } else if (user.role == AppConstants.SELLER) {
      this.router.navigate(['/account-settings']);
    }
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.authService.getCurrentUser().pipe(take(1)).subscribe(resObj => {
          if (this.authService.login(resObj)) {
            this.userService.getUserDetailsByAuthId(resObj.uid).subscribe(e => {
              const response = e.map(obj => ({
                docId: obj.payload.doc.id,
                ...obj.payload.doc.data()
              } as UserInfo))
              this.currentUser = response[0];
              this.navigateUserByRole(this.currentUser)
            });
          }
        });
        }, err => {
          console.log(err);
          alert(err.message);
        });
      }
}
