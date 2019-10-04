import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
   
  constructor() {}

  public isAuthenticated(): boolean {
    const userData = sessionStorage.getItem('userData');
    console.log(userData);
    if (userData && userData.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public async login(postData) {
    const loginApiResponce = {
      name: 'Srinivas Tamada',
      uid: 1,
      token: '2323523523DFSWERWERWER'
    };
    await sessionStorage.setItem('userData', JSON.stringify(loginApiResponce));
    return false;
  } 

  public async logout() {
    await sessionStorage.removeItem('userData');
    await sessionStorage.clear();
    return true;
  }
}
