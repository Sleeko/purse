import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '../model/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private db : AngularFirestore
  ) { }

  createNewStore(store : Store){
    return this.db.collection('/store').add(store);
  }

  getAllStores(){
    return this.db.collection('/store').snapshotChanges();
  }

  updateStore(store: Store){
    return this.db.doc('/store/'+store.docId).update(store);
  }

}
