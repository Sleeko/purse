import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
    public router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }

}
