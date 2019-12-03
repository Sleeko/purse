import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;

  constructor(public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    private firestore: AngularFirestore) {}

  getPurse() {
    return this.firestore.collection('user-information').snapshotChanges();
  }

  public isAuthenticated(): boolean {
    const userData : any = sessionStorage.getItem('userData');
    if (userData && userData.length > 0) {
      const d = JSON.parse(userData);
      return d.isLoggedIn ? true : false;
    } else {
      return false;
    }
  }

  public async login(postData) {
    const loginApiResponce = {
      uid: postData.uid,
      isLoggedIn: postData.isLoggedIn
    };
    await sessionStorage.setItem('userData', JSON.stringify(loginApiResponce));
    return false;
  }

  public async logout() {
    await sessionStorage.removeItem('userData');
    await sessionStorage.clear();
    return true;
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

  getCurrentUser() {
    const user$ = new Subject<any>();
    this.afAuth.authState.subscribe((auth) => {
      if (auth && auth.uid) {
        const userData = { uid: auth.uid, isLoggedIn: true};
        user$.next(userData);
      }
    });
    return user$.asObservable();
  }

}
