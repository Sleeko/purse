import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FeaturedContent } from '../model/featured-content.model';
import * as firebase from 'firebase/app';
import 'firebase/storage'


@Injectable({
  providedIn: 'root'
})
export class FeaturedContentService {

  constructor(private db : AngularFirestore) { }

  private basePath : string = '/featuredContent'


  uploadImage(content : FeaturedContent, image : File){
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
            this.saveNewFeaturedContent(content);
        });
      }
    );
  }
  
  getAllFeaturedContent(){
    return this.db.collection('featuredContent').snapshotChanges();
  }

  private saveNewFeaturedContent(content: FeaturedContent) {
    return this.db.collection('featuredContent').add(content);
  }
  

}
