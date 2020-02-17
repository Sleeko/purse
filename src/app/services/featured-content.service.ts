import { Injectable } from '@angular/core';
import { FeaturedContent } from '../model/featured-content.model';
import * as firebase from 'firebase/app';
import 'firebase/storage'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class FeaturedContentService {

  private url = AppConstants.BASE_API_URL;
  private headers = {
    'Content-Type':'application/json',
    'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
  }

  constructor(
    private http: HttpClient,
    private growlService : ToastrService,
    private spinnerService : NgxSpinnerService
    ) { }

  private basePath : string = '/featuredContent'


  uploadImage(photo : File, featuredContent : FeaturedContent){
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
                resolve(featuredContent.imageName = downloadUrl);
          
        }).then(data => {
          this.saveNewFeaturedContent(featuredContent).subscribe(data => {
            return data;
          });
           isFinished = true;
        });
      }
    );
  })
}

  updateFeaturedContent(featured : FeaturedContent){
    return this.http.put(this.url + '/api/admin/update-featuredContent', featured, {headers : this.headers});
  }

  deleteFeaturedContent(featured : FeaturedContent){
    return this.http.delete(this.url + '/api/admin/delete-featuredContent/' + featured.id, {headers : this.headers});
  }
  
  getAllFeaturedContent(){
    return this.http.get<FeaturedContent[]>(this.url + '/api/admin/list-featuredContent');
  }

  saveNewFeaturedContent(content: FeaturedContent) {
    return this.http.post(this.url + '/api/admin/create-featuredContent', content, {headers : this.headers});
  }
  

}
