import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  templateUrl: 'account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {

  registerCompleteFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    public router: Router) { }


  ngOnInit() {
    this.registerCompleteFormGroup = this.formBuilder.group({
      firstName: ['',[Validators.required]],
      middleName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      address: ['',[Validators.required]],
      dateOfBirth: [null,[Validators.required]],
      placeOfBirth: [null,[Validators.required]],
      gender: ['Male',[Validators.required]],
      civilStatus: ['',[Validators.required]],
      nationality: ['',[Validators.required]],
      contactNumber: ['',[Validators.required]],
      tinNumber: [null,[Validators.required]],
      bankAccount: [null,[Validators.required]],
      emailAddress: ['',[Validators.required]],
      photo: [null,[Validators.required]],
      paymayaAccount: [null,[Validators.required]],
      beneficiaries: this.formBuilder.array([this.beneficiaries])
    });
    console.log(this.registerCompleteFormGroup);
    
  }

  get beneficiaries(): FormGroup {
    return this.formBuilder.group({
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      dateOfBirth: null,
      placeOfBirth: null,
      gender: 'Male',
      civilStatus: '',
      nationality: '',
      contactNumber: '',
      tinNumber: '',
    });
  }


  addBenefeciary() {
    (this.registerCompleteFormGroup.get("beneficiaries") as FormArray).push(this.beneficiaries);
  }

  deleteBeneficiary(index) {
    (this.registerCompleteFormGroup.get("beneficiaries") as FormArray).removeAt(index);
  }


  register(value: any) {

  }


}