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
import { AccountInfo } from '../../model/account-info.model';
import { GovermentDocuments } from '../../model/goverment-docs.model';
import { AdvGrowlService } from 'primeng-advanced-growl';
import { NgxSpinnerService } from 'ngx-spinner';

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
  isInvalidBeneficiary: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private userService: UserService,
    private datePipe: DatePipe,
    public router: Router,
    private growlService : AdvGrowlService,
    private spinner : NgxSpinnerService) { }


  ngOnInit() {
    this.getCurrentUser();
    let nowDate = new Date().toISOString().split('T')[0];
    console.log(nowDate);
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
      contactNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      photo: ['']
    })

    this.buildBankForm();
    this.buildGovernmentForm();
    this.buildBeneficiariesForm();
    this.checkBeneficiaryValidity();

  }


  /**
   * Checks the beneficiary FormArray if the values are not valid. 
   */
  checkBeneficiaryValidity() {
    var beneficariesData: PersonalInfo[] = [];

    this.beneficiariesForm.valueChanges.subscribe(data => {
      beneficariesData = this.beneficiariesForm.get('beneficiaries').value
      this.isInvalidBeneficiary = beneficariesData.some(ben => {
        let birthDate = new Date(ben.dateOfBirth);
        let age = moment().diff(birthDate, 'years');
        return ben.address == null || ben.address == "" || ben.civilStatus == null
          || ben.civilStatus == "" || ben.contactNumber == null || ben.contactNumber == ""
          || ben.dateOfBirth == null || ben.dateOfBirth == "" || ben.firstName == null
          || ben.firstName == "" || ben.gender == null || ben.gender == ""
          || ben.lastName == null || ben.lastName == "" || ben.middleName == null
          || ben.middleName == "" || ben.nationality == null || ben.nationality == ""
          || ben.placeOfBirth == null || ben.placeOfBirth == "" || ben.tinNumber == null || age < 18
      })
    })
  }


  /**
   * Build Beneficiary FormArray
   */
  buildBeneficiariesForm() {
    this.beneficiariesForm = this.formBuilder.group({
      beneficiaries: this.formBuilder.array([this.beneficiaries()]),
    })

  }

  get getBene() {
    return <FormArray>this.beneficiariesForm.controls.beneficiaries;
  }

  /**
   * Remove 1 entry of Beneficiary Form in UI.
   * @param index Index of the array to be removed.
   */
  removeBene(index: number) {
    this.getBene.removeAt(index);
  }

  /**
   * Build single beneficiary form.
   */
  beneficiaries() {
    let nowDate = new Date().toISOString().split('T')[0];
    return this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateOfBirth: [nowDate, [Validators.required, CustomValidators.ageValidator]],
      placeOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      civilStatus: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      tinNumber: [null, [Validators.required]],
    });
  }

  /**
   * Build GovernmentDocument Form.
   */
  buildGovernmentForm() {
    this.governmentForm = this.formBuilder.group({
      tinNumber: ['', Validators.required]
    })
  }

  /**
   * Build AccountInfo Form.
   */
  buildBankForm() {
    this.bankForm = this.formBuilder.group({
      bankAccountNumber: [null, Validators.required],
      paymayaAccountNumber: [null, Validators.required]
    })
  }

  /**
   * Gets current changes from the UI and saves the changes to database.
   */
  updateUserInfo() {
    this.spinner.show();
    var userInfo = this.mapFormToUserInfo();
    if (this.photoFile != null || this.photoFile != undefined) {
    this.userService.uploadPhoto(this.photoFile, userInfo).then(res => {
      alert('Update Successful')
    })
    } else {
      this.userService.updateUserInfo(userInfo).subscribe(
        data => {
          this.growlService.createTimedSuccessMessage('User Successfully Updated', 'Success', 5000);
        },
        err => {
          this.growlService.createTimedErrorMessage('Error Updating User', 'Error', 5000);
        },
        () => {
          this.spinner.hide();
        }
      )
    }
  }

  /**
   * Maps the data from the Reactive Form to Object Models.
   */
  mapFormToUserInfo() {
    var userInfo: UserInfo = new UserInfo();
    userInfo = this.userInfo[0] ? this.userInfo[0] : new UserInfo();
    var personalInfo: PersonalInfo = this.personalInfoForm.getRawValue();
    personalInfo.photoUrl = userInfo.personalInfo ? userInfo.personalInfo.photoUrl : null;
    var beneficiaries: PersonalInfo[] = this.beneficiariesForm.get('beneficiaries').value;
    var accountInfo : AccountInfo = this.bankForm.getRawValue();
    var governmentDocuments : GovermentDocuments = this.governmentForm.getRawValue();
    userInfo.personalInfo = typeof personalInfo.lastName === "undefined" ? null : personalInfo;
    userInfo.beneficiaries = beneficiaries;
    userInfo.accountInfo = typeof accountInfo.bankAccountNumber === "undefined" ? null : accountInfo
    userInfo.governmentDocuments = typeof governmentDocuments.tinNumber === "undefined" ? null : governmentDocuments;
    if (beneficiaries[0].firstName == "" || beneficiaries[0].lastName == "") {
      userInfo.beneficiaries = null
    } 
    return userInfo;
  }

  /**
   * Gets current logged in user in the app.
   */
  getCurrentUser() {
    this.userService.getCurrentUser().then(res => {
      var test = this.userService.getUserDetails(res.email).subscribe(
        data => {
          
        },
        err => {

        },
        () => {

        }
    )})
  }

  /**
   * Maps Objects to Reactive Form.
   * @param userInfo 
   */
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
      tinNumber: userInfo.governmentDocuments ? userInfo.governmentDocuments.tinNumber : "000000000000"
    });

    let array: PersonalInfo[] = userInfo.beneficiaries;
    let beneficiaries = <FormArray>this.beneficiariesForm.controls['beneficiaries'];

    if (array) {
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

  /**
   * Adds another Beneficiary Form entry in UI
   */
  addBenefeciary() {
    (this.beneficiariesForm.get('beneficiaries') as FormArray).push(this.beneficiaries());
  }
  
  /**
   * Removes one Beneficiary Form in the UI.
   * @param index 
   */
  deleteBeneficiary(index) {
    (this.beneficiariesForm.get('beneficiaries') as FormArray).removeAt(index);
  }

  /**
   * Gets the image file from the UI.
   * @param $event 
   */
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