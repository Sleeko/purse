import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '../../model/store.model';
import { StoreService } from '../../services/store.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  storeForm : FormGroup;
  createStore : boolean = false;
  stores : Store[] = [];
  clonedStore : Store[] = [];
  editIndex : number;
  enableStoreEdit : boolean = false;

  constructor(
    private activeModal : NgbActiveModal,
    private formBuilder : FormBuilder,
    private spinner : NgxSpinnerService,
    private storeService : StoreService,
    private messageService : MessageService,
    private router : Router
  ) { }


  ngOnInit() {
    this.storeForm = this.formBuilder.group({
      storeCode : ['', Validators.required],
      storeName : ['', Validators.required],
      storeDescription : ['', Validators.required],
      location : ['', Validators.required]
    });
    this.getAllStores();
  }

  getAllStores(){
    this.storeService.getAllStores().subscribe(e => {
      const response = e.map(obj => ({
        docId : obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as Store));
      this.stores = response;
    })
  }

  createNewStore(store : Store){
    this.storeService.createNewStore(store);
  }

  enableEdit(index : number){
    this.enableStoreEdit = true;
    this.editIndex = index;
  }

  cancelEdit(index : number){
    this.enableStoreEdit = false;
    this.editIndex = null;
  }

  updateStore(store : Store){
    this.storeService.updateStore(store).then(data => {
      this.enableStoreEdit = false;
    });
  }
}
