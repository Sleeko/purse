import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { PersonalInfo } from '../model/personal-info.model';
import { UserInfo } from '../model/user-info.model';
import 'firebase/storage'
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConstants } from '../app.constants';
/**
 * @author Bryan
 */

@Injectable()
export class UserService {

    
  private basePath : string = '/userInfo';

  private url = AppConstants.BASE_API_URL;
  private headers = {
    'Content-Type':'application/json',
    'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
  }

    constructor(
        private http: HttpClient
    ) {}

    uploadPhoto(photo : File, userInfo : UserInfo){
        var isFinished : boolean = false;
        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child(`${this.basePath}/${photo.name}`).put(photo);
        return new Promise<any>((resolve, reject) => {
        const res = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) =>  {
            // upload in progress
          },
          (error) => {
            // upload failed
          },
          () => {
            // upload success
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadUrl) {
                    resolve(userInfo.personalInfo.photoUrl = downloadUrl);
              
            }).then(data => {
               var update =  this.updateUserInfo(userInfo);
               isFinished = true;
            });
          }
        );
      })
    }
    

    getCurrentUser() {
        return new Promise<any>((resolve, reject) => {
            const userInfo = firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    resolve(user);
                } else {
                    reject('No user logged in');
                }
            });
        });
    }

    getUserDetails(email : string){
        const payload = {
            headers : this.headers,
            body : {
            params : new HttpParams().set(
                    'email', email
                )}
        }
        return this.http.get(this.url + '/api/admin/get-user-details', payload);
    }

    getUserDetailsByAuthId(id : string){
        // return this.db.collection('/userInfo', ref => ref.where('authId','==', id)).snapshotChanges();
    }

    updateUserInfo(info : UserInfo){
        console.log('updateUserInfo')
        return this.http.put(this.url + '/api/admin/update-user', info, {headers : this.headers})
    }

    updateCurrentUser(value) {
        return new Promise<any>((resolve, reject) => {
            const user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: value.name,
                photoURL: user.photoURL
            }).then(res => {
                resolve(res);
            }, err => reject(err));
        });
    }


    // CRUD Section
    saveUserInfo(userInfo) {
        return this.http.post(this.url + '/api/admin/add-user', userInfo);
    }
}
