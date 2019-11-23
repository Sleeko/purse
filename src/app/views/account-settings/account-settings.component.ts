import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CustomValidators } from '../../utils/custom-validators';
import * as moment from 'moment';
import { PersonalInfo } from '../../model/personal-info.model';
import { UserService } from '../../services/user.service';
import { FirebaseUserModel } from '../../model/user.model';
import { UserInfo } from '../../model/user-info.model';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  templateUrl: 'account-settings.component.html',
  styleUrls: ['./account-settings.css']
})
export class AccountSettingsComponent implements OnInit {

  registerCompleteFormGroup: FormGroup;
  personalInfoForm: FormGroup;
  photoFile: any;
  userInfo: UserInfo[] = [];

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private userService: UserService,
    private datePipe: DatePipe,
    public router: Router) { }


  ngOnInit() {
    this.getCurrentUser();
    let nowDate = new Date().toISOString().split('T')[0];
    console.log(nowDate);
    this.registerCompleteFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateOfBirth: [nowDate, [Validators.required, CustomValidators.ageValidator]],
      placeOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      civilStatus: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      tinNumber: [null, [Validators.required]],
      bankAccount: [null, [Validators.required]],
      emailAddress: [null],
      photo: [null, [Validators.required]],
      paymayaAccount: [null, [Validators.required]],
      beneficiaries: this.formBuilder.array([this.beneficiaries])
    });

    // this.personalInfoForm = this.formBuilder.group({
    //   firstName: ['', [Validators.required]],
    //   middleName: ['', [Validators.required]],
    //   lastName: ['', [Validators.required]],
    //   address: ['', [Validators.required]],
    //   dateOfBirth: [nowDate, [Validators.required, CustomValidators.ageValidator]],
    //   placeOfBirth: [null, [Validators.required]],
    //   gender: [null, [Validators.required]],
    //   civilStatus: ['', [Validators.required]],
    //   nationality: ['', [Validators.required]],
    //   contactNumber: ['', [Validators.required]],
    // })
  }

  get beneficiaries(): FormGroup {
    let nowDate = new Date().toISOString().split('T')[0];
    console.log('now ' + nowDate)
    return this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateOfBirth: [nowDate, [Validators.required]],
      placeOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      civilStatus: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      tinNumber: [null, [Validators.required]],
    });
  }

  updatePersonalInfo(value) {
    console.log('update')
    var userInfo = this.mapFormToUserInfo(value);
    if (this.registerCompleteFormGroup.get('photo').dirty) {
      this.userService.uploadPhoto(this.photoFile, userInfo) ? alert('Update Successful') : null;
      this.registerCompleteFormGroup.get('photo').markAsPristine();
    } else {
      this.userService.updateUserInfo(userInfo).then( e => {
        alert('Update Successful')
      })
    }
  }

  mapFormToUserInfo(value){
    var userInfo : UserInfo = this.userInfo[0];

    var beneficiaries: PersonalInfo[] = value.beneficiaries;

    userInfo.governmentDocuments.tinNumber = value.tinNumber;
    userInfo.accountInfo.bankAccountNumber = value.bankAccount;
    userInfo.accountInfo.paymayaAccountNumber = value.paymayaAccount;
    userInfo.personalInfo.civilStatus = value.civilStatus;
    userInfo.personalInfo.contactNumber = value.contactNumber;
    userInfo.personalInfo.dateOfBirth = value.dateOfBirth;
    userInfo.personalInfo.firstName = value.firstName;
    userInfo.personalInfo.gender = value.gender;
    userInfo.personalInfo.lastName = value.lastName;
    userInfo.personalInfo.middleName = value.middleName;
    userInfo.personalInfo.nationality = value.nationality;
    userInfo.personalInfo.placeOfBirth = value.placeOfBirth;
    userInfo.personalInfo.photoUrl = this.userInfo[0].personalInfo.photoUrl;
    userInfo.beneficiaries = beneficiaries;

    return userInfo;
  }

  getCurrentUser() {
    this.userService.getCurrentUser().then(res => {
     var test =  this.userService.getUserDetails(res.email).subscribe(e => {
        const response = e.map(obj => ({
          docId: obj.payload.doc.id,
          ...obj.payload.doc.data()
        } as UserInfo))
        this.userInfo = response;
        console.log('User Info ', this.userInfo[0])
        this.mapUserInfoToForm(this.userInfo[0]);
        test.unsubscribe();
        },
        err => {

        },
        () => {
        })
    });
  }

  mapUserInfoToForm(userInfo: UserInfo) {
    this.registerCompleteFormGroup.patchValue({
      firstName: userInfo.personalInfo.firstName,
      middleName: userInfo.personalInfo.middleName,
      lastName: userInfo.personalInfo.lastName,
      address: userInfo.personalInfo.address,
      dateOfBirth: "birthdate",
      placeOfBirth: userInfo.personalInfo.placeOfBirth,
      gender: userInfo.personalInfo.gender,
      civilStatus: userInfo.personalInfo.civilStatus,
      nationality: userInfo.personalInfo.nationality,
      contactNumber: userInfo.personalInfo.contactNumber,
      bankAccount : userInfo.accountInfo.bankAccountNumber,
      paymayaAccount : userInfo.accountInfo.paymayaAccountNumber,
      tinNumber : userInfo.governmentDocuments.tinNumber
    })

    let array: PersonalInfo[] = userInfo.beneficiaries;
    let beneficiaries = <FormArray>this.registerCompleteFormGroup.controls['beneficiaries'];

    array.forEach(beneficiary => {
      beneficiaries.push(this.formBuilder.group(beneficiary));
    })
    beneficiaries.removeAt(0);

  }


  addBenefeciary() {
    (this.registerCompleteFormGroup.get('beneficiaries') as FormArray).push(this.beneficiaries);
  }

  deleteBeneficiary(index) {
    (this.registerCompleteFormGroup.get('beneficiaries') as FormArray).removeAt(index);
  }

  onFileChange($event) {
    this.photoFile = $event.target.files[0]; // <--- File Object for future use.
    console.log(this.photoFile);
    this.registerCompleteFormGroup.controls['photo'].setValue(this.photoFile ? this.photoFile.name : ''); // <-- Set Value for Validation
  }

  test() {
    console.log(this.registerCompleteFormGroup.value);
  }

  completeRegister(value: any) {

    var personalInfo: PersonalInfo;
    personalInfo = this.registerCompleteFormGroup.getRawValue();
    console.log(personalInfo)

    this.accountService.savePhotoAndRegister(this.photoFile, value).subscribe(
      data => {

      },
      err => {

      },
      () => {
        alert('Registration Successfully completed');
      });
  }


  // Clone any Object
  cloneObject(object: any) {
    return (JSON.parse(JSON.stringify(object)));
  }


}