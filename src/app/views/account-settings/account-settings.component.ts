import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CustomValidators } from '../../utils/custom-validators';
import * as moment from 'moment';

@Component({
  templateUrl: 'account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {

  registerCompleteFormGroup: FormGroup;
  photoFile: any;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    public router: Router) { }


  ngOnInit() {
    let nowDate = new Date().toISOString().split('T')[0];
    console.log(nowDate);
    this.registerCompleteFormGroup = this.formBuilder.group({
      firstName: ['',[Validators.required]],
      middleName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      address: ['',[Validators.required]],
      dateOfBirth: [nowDate,[Validators.required, CustomValidators.ageValidator]],
      placeOfBirth: [null,[Validators.required]],
      gender: [null,[Validators.required]],
      civilStatus: ['',[Validators.required]],
      nationality: ['',[Validators.required]],
      contactNumber: ['',[Validators.required]],
      tinNumber: [null,[Validators.required]],
      bankAccount: [null,[Validators.required]],
      emailAddress: [null],
      photo: [null,[Validators.required]],
      paymayaAccount: [null,[Validators.required]],
      beneficiaries: this.formBuilder.array([this.beneficiaries])
    });
    console.log(this.registerCompleteFormGroup);
    
  }

  get beneficiaries(): FormGroup {
    let nowDate = new Date().toISOString().split('T')[0];
    return this.formBuilder.group({
      firstName: ['',[Validators.required]],
      middleName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      address: ['',[Validators.required]],
      dateOfBirth: [nowDate,[Validators.required]],
      placeOfBirth: [null,[Validators.required]],
      gender: [null,[Validators.required]],
      civilStatus: ['',[Validators.required]],
      nationality: ['',[Validators.required]],
      contactNumber: ['',[Validators.required]],
      tinNumber: [null,[Validators.required]],
    });
  }


  addBenefeciary() {
    (this.registerCompleteFormGroup.get("beneficiaries") as FormArray).push(this.beneficiaries);
  }

  deleteBeneficiary(index) {
    (this.registerCompleteFormGroup.get("beneficiaries") as FormArray).removeAt(index);
  }

  onFileChange($event) {
    this.photoFile = $event.target.files[0]; // <--- File Object for future use.
    console.log(this.photoFile);
    this.registerCompleteFormGroup.controls['photo'].setValue(this.photoFile ? this.photoFile.name : ''); // <-- Set Value for Validation
  }


  completeRegister(value: any) {
    this.accountService.savePhotoAndRegister(this.photoFile, value).subscribe(
      data=> {

      },
      err=>{

      }, 
      ()=> {
        alert('Registratio Successfuly completed');
      }
    )
  }

  

  // Clone any Object
  cloneObject(object: any) {
    return (JSON.parse(JSON.stringify(object)));
  }


}