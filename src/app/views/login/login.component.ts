import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  public errorText: string;

  loginForm: FormGroup;

  constructor(public authService: AuthService,
    public router: Router,
    private fb: FormBuilder) {
    this.errorText = '';
    this.createForm();
  }
  data: any[];
  ngOnInit() {}

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {       
        this.authService.getCurrentUser().pipe(take(1)).subscribe(resObj => {
          if (this.authService.login(resObj)) {
            this.router.navigate(['/dashboard']);
          }
        });
      }, err => {
        console.log(err);
        alert(err.message);
      });
  }
}
