import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { AccountInfo } from '../../model/account-info.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Profile } from './../../model/profile.model';
import { Beneficiaries } from '../../model/beneficiaries.model';
import { MemberProfile } from './../../model/member-profile.model';
import { BankAccount } from './../../model/bank-account.model';
import { GovermentDocuments } from './../../model/government-documents.model';
import { ToastrService } from 'ngx-toastr';

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
  profile : Profile = new Profile();
  isInvalidBeneficiary: boolean = false;
  currentUser : any;
  userId;
  photoUrl : String = '';
  isDuplicateProfile : boolean = false;
  isDuplicateGovernmentProfile : boolean = false;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private userService: UserService,
    private datePipe: DatePipe,
    public router: Router,
    private growlService : ToastrService,
    private spinner : NgxSpinnerService,
    private cdr : ChangeDetectorRef) { }


  ngOnInit() {
    this.getCurrentUser();
    let nowDate = new Date().toISOString().split('T')[0];
    this.personalInfoForm = this.formBuilder.group({
      id: [''],
      uid : [this.userId],
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      birthday: [nowDate, [Validators.required, CustomValidators.ageValidator]],
      birthPlace: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      civilStatus: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      photoUrl: [''],
    })

    this.buildBankForm();
    this.buildGovernmentForm();
    this.buildBeneficiariesForm();
  }

  /**
   * Build Beneficiary FormArray
   */
  buildBeneficiariesForm() {
    this.beneficiariesForm = this.beneficiaries();
  }


  /**
   * Build single beneficiary form.
   */
  beneficiaries() {
    let nowDate = new Date().toISOString().split('T')[0];
    return this.formBuilder.group({
      id: [''],
      uid : [this.userId],
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      birthday: [nowDate, [Validators.required, CustomValidators.ageValidator]],
      birthPlace: [null, [Validators.required]],
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
      id: [''],
      uid : [this.userId],
      tinId: ['', Validators.required]
    })
  }

  /**
   * Build AccountInfo Form.
   */
  buildBankForm() {
    this.bankForm = this.formBuilder.group({
      id: [''],
      uid : [this.userId],
      bankAccount: ['', Validators.required],
      paymayaAccount: ['', Validators.required]
    })
  }

  /**
   * Gets current changes from the UI and saves the changes to database.
   */
  updateUserInfo() {
    this.spinner.show();
    var profile : Profile = this.mapFormToUserInfo();
    if (this.photoFile != null || this.photoFile != undefined) {
    this.userService.uploadPhoto(this.photoFile, profile).then(res => {
      this.growlService.success('User Successfully Updated', 'Success');
      this.spinner.hide();
      this.photoUrl = res;
    })
    } else {
      this.userService.updateUserInfo(profile).subscribe(
        data => {
          this.growlService.success('User Successfully Updated', 'Success');
        },
        err => {
          this.growlService.error('Error Updating User', 'Error');
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
    var profile : Profile = new Profile();
    profile = this.profile[0] ? this.profile[0] : new Profile();
    var memberProfile: MemberProfile = this.personalInfoForm.getRawValue();
    memberProfile.photoUrl = profile.memberProfile ? profile.memberProfile.photoUrl : null;
    var beneficiaries : Beneficiaries =  this.beneficiariesForm.getRawValue();
    var bankAccount : BankAccount = this.bankForm.getRawValue();
    var governmentDocuments : GovermentDocuments = this.governmentForm.getRawValue();
    profile.memberProfile = memberProfile;
    profile.beneficiaries = beneficiaries;
    profile.bankAccount = bankAccount;
    profile.govDocs = governmentDocuments;

    return profile;
  }

  /**
   * Gets current logged in user in the app.
   */
  getCurrentUser() {
    this.userId = JSON.parse(sessionStorage.getItem('currentUser')).userData.userId;
    this.userService.getUserDetailsByAuthId(JSON.parse(sessionStorage.getItem('currentUser')).authToken).subscribe(data => {
      this.profile = data;
      this.photoUrl = this.profile.memberProfile.photoUrl;
    }, err => {

    }, () => {
      this.mapUserInfoToForm(this.profile);
    })
      
    
  }

  checkIfProfileIsDuplicate(origin : string){
    var profile = this.mapFormToUserInfo();
    var origin = origin;
    var res : any;
    this.userService.checkProfileDuplicate(profile, origin).subscribe(
      data => {
        res = data;
          this.isDuplicateGovernmentProfile = false;
          this.isDuplicateProfile = false;
      },
      err => {
        if(origin == 'PROFILE'){
          this.isDuplicateProfile = true;
        } else if(origin == 'GOV') {
          this.isDuplicateGovernmentProfile = true;
        } 
      }
      
    )
  }

  /**
   * Maps Objects to Reactive Form.
   * @param userInfo 
   */
  mapUserInfoToForm(profile: Profile) {
    if(profile.memberProfile){
      this.personalInfoForm.patchValue({
        id : profile.memberProfile.id,
        firstName: profile.memberProfile.firstName,
        middleName: profile.memberProfile.middleName,
        lastName: profile.memberProfile.lastName,
        address: profile.memberProfile.address,
        birthday: new Date(profile.memberProfile.birthday).toISOString().substring(0,10),
        birthPlace: profile.memberProfile.birthPlace,
        gender: profile.memberProfile.gender,
        civilStatus: profile.memberProfile.civilStatus,
        nationality: profile.memberProfile.nationality,
        contactNumber: profile.memberProfile.contactNumber,
        
      });
    }

    if(profile.govDocs){
      this.governmentForm.patchValue({
        id : profile.govDocs.id,
        tinId: profile.govDocs ? profile.govDocs.tinId : "000000000000"
      });
    }

    if(profile.beneficiaries){
      this.beneficiariesForm.patchValue({
        id: profile.beneficiaries.id,
        firstName: profile.beneficiaries.firstName,
        middleName: profile.beneficiaries.middleName,
        lastName: profile.beneficiaries.lastName,
        address: profile.beneficiaries.address,
        birthday: new Date(profile.beneficiaries.birthday).toISOString().substring(0,10),
        birthPlace: profile.beneficiaries.birthPlace,
        gender: profile.beneficiaries.gender,
        civilStatus: profile.beneficiaries.civilStatus,
        nationality: profile.beneficiaries.nationality,
        contactNumber: profile.beneficiaries.contactNumber,
        tinNumber : profile.beneficiaries.tinNumber
      })
    }
  
    if(profile.bankAccount){
      this.bankForm.patchValue({
        id : profile.bankAccount.id,
        bankAccount: profile.bankAccount.bankAccount,
        paymayaAccount: profile.bankAccount.paymayaAccount
      })
    }

    this.personalInfoForm.markAsPristine();
  }

  /**
   * Gets the image file from the UI.
   * @param $event 
   */
  onFileChange($event) {
    this.photoFile = $event.target.files[0]; // <--- File Object for future use.
    this.personalInfoForm.controls['photoUrl'].setValue(this.photoFile ? this.photoFile.name : ''); // <-- Set Value for Validation
  }


  completeRegister(value: any) {

    var personalInfo: PersonalInfo;
    personalInfo = this.registerCompleteFormGroup.getRawValue();

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