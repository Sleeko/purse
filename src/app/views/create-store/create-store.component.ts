import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '../../model/store.model';
import { StoreService } from '../../services/store.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppConstants } from '../../app.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  storeForm: FormGroup;
  createStore: boolean = false;
  stores: Store[] = [];
  clonedStore: Store[] = [];
  editIndex: number;
  enableStoreEdit: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private storeService: StoreService,
    private messageService: MessageService,
    public router: Router,
    private growlService : ToastrService,
    private spinnerService : NgxSpinnerService
  ) { }


  ngOnInit() {
    this.storeForm = this.formBuilder.group({
      storeCode: ['', Validators.required],
      storeName: ['', Validators.required],
      storeDescription: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.getAllStores();
  }

  /**
   * Gets all Store in database.
   */
  getAllStores() {
    this.storeService.getAllStores().subscribe(
      data => {
        this.stores = data;
      }, 
      err => {

      }, 
      () => {
        this.stores = this.stores.filter(store => store.status == AppConstants.ACTIVE);
      });
  }
  /**
   * Creates a new entry for Store.
   * @param store 
   */
  createNewStore(store: Store) {
    this.spinnerService.show()
    this.storeService.createNewStore(store).subscribe(data => {
        if(data.success){
          this.growlService.success('Store Created', 'Success');
        } else {
          this.growlService.error('Error creating store', 'Error');
        }
    },
    err => {
      this.growlService.error('Error creating store', 'Error');
    },
    () => {
      this.spinnerService.hide()
      window.location.reload();
    })
  }

  /**
   * Enables the edit feature of a store row.
   * @param index 
   */
  enableEdit(index: number) {
    this.enableStoreEdit = true;
    this.editIndex = index;
  }

  /**
   * Disables the edit feature of a store row.
   * @param index 
   */
  cancelEdit(index: number) {
    this.enableStoreEdit = false;
    this.editIndex = null;
  }

  /**
   * Deletes a row of store.
   * @param store 
   */
  deleteStore(store : Store){
    this.spinnerService.show()
    this.storeService.deleteStore(store).subscribe(
      data => {
        if(data.success){
          this.growlService.success('Store Deleted', 'Success');
        } else {
          this.growlService.error('Error deleting store', 'Error');
        }      
      },
      err => {
        this.growlService.error('Error deleting store', 'Error');
      },
      () => {
        this.spinnerService.hide();
        window.location.reload();
      }
    )
  }

  /**
   * Updates the current Store changed by the user.
   * @param store 
   */
  updateStore(store: Store) {
    this.spinnerService.show();
    this.storeService.updateStore(store).subscribe(data => {
      this.enableStoreEdit = false;
      if(data.success){
        this.growlService.success('Store Updated', 'Success');
      } else {
        this.growlService.error('Error updating store', 'Error');
      }
    },
    err => {
      this.growlService.error('Error updating store', 'Error');
    },
    () => {
      this.spinnerService.hide();
      window.location.reload();
    });
  }
}
