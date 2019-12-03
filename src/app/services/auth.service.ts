import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;

  constructor(public afAuth: AngularFireAuth,
    private db: AngularFirestore) {}


  public isAuthenticated(): boolean {
    const userData : any = sessionStorage.getItem('authData');
    if (userData && userData.length > 0) {
      const d = JSON.parse(userData);
      return d.isLoggedIn ? true : false;
    } else {
      return false;
    }
  }

  public async login(postData) {
    const loginApiResponse = {
      authId: postData.uid,
      isLoggedIn: postData.isLoggedIn
    };
    this.db.collection('userInfo', ref => ref.where('authId', '==', postData.uid)).snapshotChanges()
      .pipe(take(1)).subscribe(e => {
        const response : any = e.map(obj => ({docId: obj.payload.doc.id,
          ...obj.payload.doc.data()}));
          const userInfo = {
              authId: response[0].authId,
              uid: response[0].uid,
              email: response[0].email,
              role: response[0].role
          };
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      });
    await sessionStorage.setItem('authData', JSON.stringify(loginApiResponse));
    return false;
  }

  public async logout() {
    await sessionStorage.removeItem('userInfo');
    await sessionStorage.removeItem('authData');
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
