import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss']
})
export class SellerProfileComponent implements OnInit {

  private sellerProfileForm : FormGroup;
  private sellerProfileEditDisabled : boolean = true;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initSellerProfile();
  }

  initSellerProfile(){
    this.sellerProfileForm = this.formBuilder.group({
      sellerName : ['Christian Santos'],
      contactNumber : [{value :  '09661348861', disabled : this.sellerProfileEditDisabled} , Validators.required],
      sellerUrl : [{value : 'https://www.facebook.com/highschoolTeacher', disabled : this.sellerProfileEditDisabled}, Validators.required]
    });
  }

  editSellerProfile(){
    this.sellerProfileEditDisabled = false;
    this.sellerProfileForm.enable();
  }

  saveSellerProfile(){
    //TODO saving of profile to API
    this.sellerProfileEditDisabled = true;
    this.sellerProfileForm.disable();
  }

  cancelEdit(){
    this.sellerProfileEditDisabled = true;
    this.sellerProfileForm.disable();
  }

}
