import { Injectable } from '@angular/core';
import { FeaturedContent } from '../model/featured-content.model';
import * as firebase from 'firebase/app';
import 'firebase/storage'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { AdvGrowlService } from 'primeng-advanced-growl';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class FeaturedContentService {

  constructor(
    private http: HttpClient,
    private growlService : AdvGrowlService,
    private spinnerService : NgxSpinnerService
    ) { }

  private basePath : string = '/featuredContent'
  private url = AppConstants.BASE_API_URL;


  uploadImage(content : FeaturedContent, image : File){
    this.spinnerService.show()
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${image.name}`).put(image);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadUrl) {
          content.imageUrl = downloadUrl;
          content.imageName = image.name
          
        }).then(data => {
            this.saveNewFeaturedContent(content).subscribe(data => {
              this.growlService.createSuccessMessage('Content Created!', 'Success', 5000);
              this.spinnerService.hide()
            },err => {
              this.spinnerService.hide()
            }, () => this.spinnerService.hide())
        });
      }
    );
  }
  
  getAllFeaturedContent(){
    return this.http.get<FeaturedContent[]>(this.url + '/api/admin/list-featuredContent');
  }

  saveNewFeaturedContent(content: FeaturedContent) {
    const auth = JSON.parse(localStorage.getItem('currentUser')).authToken;
    const headers = {
      'Content-Type':'application/json',
      'Authorization' : 'Bearer ' + auth
    }

    return this.http.post(this.url + '/api/admin/create-featuredContent', content, {headers : headers});
  }
  

}
