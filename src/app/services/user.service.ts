import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Profile } from './../model/profile.model';
import { MemberProfile } from '../model/member-profile.model';
/**
 * @author Bryan
 */

@Injectable()
export class UserService {

  private basePath : string = '/userInfo';
  private url = AppConstants.BASE_API_URL;

    constructor(private http: HttpClient) {}

    uploadPhoto(photo : File, profile : Profile){
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
                    resolve(profile.memberProfile.photoUrl = downloadUrl);
              
            }).then(data => {
              this.updateUserInfo(profile).subscribe(data => {
                return data;
              });
               isFinished = true;
            });
          }
        );
      })
    }
    
    getUserDetails(email : string){
      // let headersX = {
      //   'Content-Type':'application/json',
      //   'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
      // }
      //   const payload = {
      //       headers : headersX,
      //       body : {
      //       params : new HttpParams().set(
      //               'email', email
      //           )}
      //   }
      //   return this.http.get(this.url + '/api/admin/get-user-details', payload);
    }

    getUserDetailsByAuthId(id : string){
       let headersX = {
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
      };
        return this.http.get<Profile>(this.url + '/api/get-accountSettings',  {headers : headersX});
    }

    updateUserInfo(profile : Profile){
      let headersX = {
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
      };
        return this.http.put(this.url + '/api/update-accountSettings', profile, {headers : headersX})
    }

    // CRUD Section
    saveUserInfo(userInfo) {
        return this.http.post(this.url + '/api/admin/add-user', userInfo);
    }

    checkProfileDuplicate(profile : Profile, origin : string){
      let headersX = {
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
      };
      if(origin == "PROFILE"){
        return this.http.post(this.url + '/api/check-duplicateProfile', profile, {headers: headersX});
      } else if(origin == "GOV"){
        return this.http.post(this.url + '/api/check-duplicateGovProfile', profile, {headers: headersX});
      }
    }
}
