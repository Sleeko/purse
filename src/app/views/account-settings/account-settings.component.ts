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
  beneficiariesForm: FormGroup;
  governmentForm: FormGroup;
  bankForm: FormGroup;
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
    // this.registerCompleteFormGroup = this.formBuilder.group({
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
    //   tinNumber: [null, [Validators.required]],
    //   bankAccount: [null, [Validators.required]],
    //   emailAddress: [null],
    //   photo: [null, [Validators.required]],
    //   paymayaAccount: [null, [Validators.required]],
    //   beneficiaries: this.formBuilder.array([this.beneficiaries])
    // });

    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateOfBirth: [nowDate, [Validators.required, CustomValidators.ageValidator]],
      placeOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      civilStatus: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      photo : ['', Validators.required]
    })

    this.buildBankForm();
    this.buildGovernmentForm();
    this.buildBeneficiariesForm();

    this.beneficiariesForm.valueChanges.subscribe(data => {
      console.log('bene ' , this.beneficiariesForm.get('beneficiaries')['controls'][0].controls.firstName)

    })
  }



  buildBeneficiariesForm() {
    this.beneficiariesForm = this.formBuilder.group({
      beneficiaries: this.formBuilder.array([this.beneficiaries()]),
    })

  }

  get getBene() {
    return <FormArray>this.beneficiariesForm.controls.beneficiaries;
  }

  removeBene(index: number) {
    this.getBene.removeAt(index);
  }

  beneficiaries() {
    let nowDate = new Date().toISOString().split('T')[0];
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
      contactNumber: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      tinNumber: [null, [Validators.required]],
    });
  }

  buildGovernmentForm() {
    this.governmentForm = this.formBuilder.group({
      tinNumber: ['', Validators.required]
    })
  }

  buildBankForm() {
    this.bankForm = this.formBuilder.group({
      bankAccountNumber: ['', Validators.required],
      paymayaAccountNumber: ['', Validators.required]
    })
  }

  updateUserInfo() {
    var userInfo = this.mapFormToUserInfo();

    if (this.photoFile != null || this.photoFile != undefined) {
      this.userService.uploadPhoto(this.photoFile, userInfo) ? alert('Update Successful') : null;
    } else {
      this.userService.updateUserInfo(userInfo).then(e => {
        console.log('e ', e);
        alert('Update Successful')
      })
    }
  }

  mapFormToUserInfo() {
    var userInfo: UserInfo = this.userInfo[0];
    var personalInfo: PersonalInfo = this.personalInfoForm.getRawValue();
    personalInfo.photoUrl = this.userInfo[0].personalInfo.photoUrl;
    var beneficiaries: PersonalInfo[] = this.beneficiariesForm.get('beneficiaries').value;
    userInfo.personalInfo = personalInfo;
    userInfo.accountInfo = this.bankForm.getRawValue();
    userInfo.beneficiaries = beneficiaries;
    userInfo.governmentDocuments = this.governmentForm.getRawValue();
    if (beneficiaries[0].firstName == "" || beneficiaries[0].lastName == ""){
      userInfo.beneficiaries = null
    } 
    return userInfo;
  }

  getCurrentUser() {
    this.userService.getCurrentUser().then(res => {
      var test = this.userService.getUserDetails(res.email).subscribe(e => {
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
    console.log('User Info ', userInfo)
      this.personalInfoForm.patchValue({
        firstName: userInfo.personalInfo.firstName,
        middleName: userInfo.personalInfo.middleName,
        lastName: userInfo.personalInfo.lastName,
        address: userInfo.personalInfo.address,
        dateOfBirth: userInfo.personalInfo.dateOfBirth,
        placeOfBirth: userInfo.personalInfo.placeOfBirth,
        gender: userInfo.personalInfo.gender,
        civilStatus: userInfo.personalInfo.civilStatus,
        nationality: userInfo.personalInfo.nationality,
        contactNumber: userInfo.personalInfo.contactNumber,
      });

      this.governmentForm.patchValue({
        tinNumber: userInfo.governmentDocuments.tinNumber
      });

      let array: PersonalInfo[] = userInfo.beneficiaries;
      let beneficiaries = <FormArray>this.beneficiariesForm.controls['beneficiaries'];

      if(array){
        array.forEach(beneficiary => {
          beneficiaries.push(this.formBuilder.group(beneficiary));
        })
        beneficiaries.removeAt(0);
      }

      this.bankForm.patchValue({
        bankAccountNumber: userInfo.accountInfo.bankAccountNumber,
        paymayaAccountNumber: userInfo.accountInfo.paymayaAccountNumber
      })
    


  }


  addBenefeciary() {
    (this.beneficiariesForm.get('beneficiaries') as FormArray).push(this.beneficiaries());
  }

  deleteBeneficiary(index) {
    (this.beneficiariesForm.get('beneficiaries') as FormArray).removeAt(index);
  }

  onFileChange($event) {
    this.photoFile = $event.target.files[0]; // <--- File Object for future use.
    console.log(this.photoFile);
    this.personalInfoForm.controls['photo'].setValue(this.photoFile ? this.photoFile.name : ''); // <-- Set Value for Validation
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