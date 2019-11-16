import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseUserModel } from '../model/user.model';

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
    const userData = sessionStorage.getItem('userData');
    if (userData && userData.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public async login(postData) {
    const loginApiResponce = {
      name: postData.name,
      uid: postData.uid,
    };
    await sessionStorage.setItem('userData', JSON.stringify(loginApiResponce));
    return false;
  }

  public async logout() {
    await sessionStorage.removeItem('userData');
    await sessionStorage.clear();
    return true;
  }

  /**
   * NOTE: there's always a better way.
   * Not yet optimized, plan to migrate it into AngularFireStore.
   */
  getListOfCode() {
    return this.db.list('/validationCode');
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
    const user = new FirebaseUserModel();
    this.afAuth.authState.subscribe((auth) => {
      if (auth && auth.uid) {
        user.uid = auth.uid;
        user.name = auth.displayName;
        this.isLoggedIn = true;
      }
    });

    return user;
  }

}
