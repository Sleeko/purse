import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NguCarouselConfig } from '@ngu/carousel';
import { Observable, interval, Subject } from 'rxjs';
import { startWith, take, map, debounceTime } from 'rxjs/operators';
import { UtilsService } from '../../services/utils.service';
import { Code } from '../../model/code.model';
import { UserService } from '../../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChamberService } from '../../services/chamber.service';
import { VirtualChamber } from '../../model/virtual-chamber.model';
import { FeaturedContentService } from '../../services/featured-content.service';
import { FeaturedContent } from '../../model/featured-content.model';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styles: [
    ` h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
    .product-style {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-size: 0.9rem;
    }
    .text-purse {
      color: #20853b;
    }
    input[type=radio] {
      height: 1.2em;
  }

  input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

    `
  ]
})
export class RegisterComponent implements OnInit {

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 3, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 1500 },
    animation: 'lazy'
  };

  featuredContents : FeaturedContent[] = [];
  carouselItems: Observable<FeaturedContent[]>;
  registerFormGroup: FormGroup;
  sellerFormGroup: FormGroup;
  listOfCode: any[];
  isSeller = 1;
  docId: any;
  CHAMBER_SIZE: number = 10;
  CONFIG_CHAMBER_SIZE: any;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private utilsService: UtilsService,
              private chamberService: ChamberService,
              public db: AngularFirestore,
              private featuredContentService : FeaturedContentService,
              public router: Router) {
              }

  ngOnInit() {
    this.carouselItems = interval(500).pipe(
      startWith(-1),
      take(10),
      map(val => {
        const i = 0;
        const data = this.featuredContents;
        return data;
      })
    );
    this.buildSellerForm();
    this.getFeaturedContents();
    this.registerFormGroup = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
        //this.validateEmail.bind(this)
      ],
      code: [
        '',
        [Validators.required],
        [this.searchCodeValidator()]
      ],
      referrerCode: [
        '',
        [Validators.required],
        [this.searchUplineValidator()]
      ],
      sellerName: [
        ''
      ],
      contactNumber: [
        null
      ],
      sellerUrl: [
        ''
      ],
      passwords: this.formBuilder.group({
          password: ['', [Validators.required]],
          confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming})
    });

  }


  buildSellerForm(){
    this.sellerFormGroup = this.formBuilder.group({
      sellerName : ['', [Validators.required]],
      contactNumber : ['',[Validators.required,Validators.maxLength(10), Validators.minLength(10)]],
      sellerUrl : ['',[Validators.required]],
      email : ['' ,[Validators.required, Validators.email]],
      passwords : this.formBuilder.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
    }, {validator: this.passwordConfirming})
  })
}

  /**
   * 
   */
  getFeaturedContents(){
    this.featuredContentService.getAllFeaturedContent().subscribe(e => {
      const response = e.map(obj => ({
        docId : obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as FeaturedContent));
      this.featuredContents = response;
    });
  }


  // WARNING!!! for development purposes. clear virtual chamber data 
  generateNewChamber() {
    this.chamberService.generateGenesisChamber('LVL_P30K').then(e => {
      console.log('error', e);
    }).catch(err => {
      console.log(err);
    })
  }

  searchCodeValidator(): AsyncValidatorFn  {
    return  (control: AbstractControl): Observable<ValidationErrors> => {
      return this.db.collection('memberCode', ref => ref.where('code', '==', control.value))
       .snapshotChanges().pipe(
          debounceTime(500),
          take(1),
          map(res => {
              if (res.length > 0) {
                this.docId = res[0].payload.doc.id;
                return null;
              } else {
                return { 'isUsed': true };
              }
            } 
          )
        );
    }
  }

  searchUplineValidator() : AsyncValidatorFn  {
    return  (control: AbstractControl): Observable<ValidationErrors> => {
      return this.db.collection('uplineLookup', ref => ref.where('uplineCode', '==', control.value))
       .snapshotChanges().pipe(
          debounceTime(500),
          take(1),
          map(res => {
              if( res.length < 3) {
                if ((res.length + 1) === 3) {
                  this.processChamberCycle(control.value, 'MOVE').pipe(take(1)).subscribe(res => {
                    const vChamberPayload = {members: res};
                    this.chamberService.updateChamber('LVL_P300',vChamberPayload);
                  });
                }
                return null;
              } else {
                return { 'referrerCodeLimit': true };
              }
          })
        );
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
      return { invalid: true };
    }
  }

  /**
   * @author Bryan
   * @method register interface for saving user information, it handles all the service call and data inputs,
   *                  data validation must visible here
   * @param formData form data from registration form
   */
  register(formData) {
    const req = {
      email: formData.email,
      code: formData.code,
      referrerCode: formData.referrerCode,
      password: formData.passwords.password,
    };

    const payload = { email: req.email, password: req.password };
    this.tryRegister(payload, req);
  }

  registerSeller(formData) {
    const req = {
      sellerName: formData.sellerName,
      contactNumber: formData.contactNumber,
      sellerUrl: formData.sellerUrl,
      email: formData.email,
      password: formData.passwords.password
    };

    const payload = { email: req.email, password: req.password };
    this.doRegisterSeller(req,payload);
  }

  /**
   * @author Bryan
   * @method tryRegister service implementation of registration, it served as the business functionality
   *                     for saving user information and handling the movement of the virtual chamber
   * @param payload form data that contain vital user information
   * @param req request data for referrer code (upline code)
   */
  tryRegister(payload, req) {
    this.authService.doRegister(payload)
      .then(res => {
        console.log('Account ID', res.user.uid);
        const userInfoPayload = {
          authId: res.user.uid,
          uid: Math.random().toString(36).substring(6).toUpperCase(),
          email: res.user.email,
          personalInfo: {},
          accountInfo: {},
          governmentDocuments: {},
          dateRegistered: new Date(),
          role: 'member'
        };

        // saving uer data
        this.userService.saveUserInfo(userInfoPayload).then(data => {
          console.log('account creation', data);
          const uplinePayload = {
            memberId: userInfoPayload.uid,
            uplineCode: req.referrerCode,
            dateRegistered: new Date()
          };

          /**
           * upline lookup service call
           */
          this.utilsService.addUplineLookUp(uplinePayload).then(e => {
              console.log('add upline lookup', JSON.stringify(e));
          }).catch(err => {
              console.log('add upline lookup error', JSON.stringify(err));
          });

          /**
           * chamber service call
           */
          this.processChamberCycle(userInfoPayload.uid, 'NEW').pipe(take(1)).subscribe(res => {
            const vChamberPayload = {members: res};
            this.chamberService.updateChamber('LVL_P300',vChamberPayload);
          });

        }).catch(error => {
          console.log('error', error);
        });

        const payloadMCode = { docId: this.docId,
          code: req.code, isUsed: true } as Code;

         /**
           * utility service call
           */
        this.utilsService.updateGeneratedCode(payloadMCode);
        alert('Your account was successfully created!.')
      }, err => {
        console.log(err.message);
        alert(err.message);
      });
  }

  doRegisterSeller(reqObj, authObj) {
    this.authService.doRegister(authObj)
    .then(res => {
      console.log('Account ID', res.user.uid);
      const userInfoPayload = {
        authId: res.user.uid,
        uid: Math.random().toString(36).substring(6).toUpperCase(),
        email: res.user.email,
        personalInfo: {},
        accountInfo: {},
        governmentDocuments: {},
        sellerInfo: reqObj,
        dateRegistered: new Date(),
        role: 'seller'
      };

      // saving seller data
      this.userService.saveUserInfo(userInfoPayload).then(data => {
        console.log('account creation', data);
      }).catch(error => {
        console.log('error', error);
      });

      alert('Your seller account was successfully created!.')
    }, err => {
      console.log(err.message);
      alert(err.message);
    });
  }


  /**
   * @author Bryan
   * @method processChamberCycle this method will process the virtual chamber cycle. It return observable
   * @param memberCode UID or member id
   * @param activity type of activity that chamber will going to execute, there are two types (NEW, MOVE)
   *                 NEW - push new member into inactive chamber
   *                 MOVE - move the member in the next possible cycle such as ACTIVE state or cycle 1..10
   */
  processChamberCycle(memberCode, activity) {
    const subj = new Subject<any>();
    
    this.chamberService.fetchVirtualChamberDataAPI().subscribe(data => {
      let r : any = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() }) as VirtualChamber);    
      //let chamberObj = r[0].members;
      // new implementation for multi-virtual user-chamber compound search
      const vChamber = r.find(i => {
        const idx = i.members.some(x => {
            let srcQry = x.memberList.find(e => e.uid === memberCode);
            if (srcQry) return x;
        });
        return idx ? idx : null;
      });
      
      let chamberObj = null;

      if (vChamber) { // nullity check
         chamberObj = vChamber.members;
      } else {
        const defaultChamber = r.find(i => i.id === 'LVL_P300');
        chamberObj = defaultChamber.members;
      }

      switch (activity) {
        case 'NEW':
          chamberObj[0].memberList.push({uid: memberCode, currentLvl:"LVL_P300",currentCycle: "INACTIVE"});
          break;

        case 'MOVE':
          let memberCycleObj = this.getMemberCycleChamber(memberCode, chamberObj);
          if (memberCycleObj) {
            let cycleMember = this.getMember(memberCode, memberCycleObj);
            if (memberCycleObj.cycleId === 0) {
              const activeCycle = memberCycleObj.cycleId + 1;
              memberCycleObj.memberList.splice(memberCycleObj.memberList.findIndex(i => i.uid === memberCode), 1);
              cycleMember.currentCycle = String(activeCycle);
              this.processRecurChamber(chamberObj, activeCycle, cycleMember);
            } else {
              this.processRecurChamber(chamberObj, memberCycleObj.cycleId, cycleMember);
            }
          }
        break;
      }
      subj.next(chamberObj); 
      
    });
    return subj.asObservable();
  }

  /**
   * @author Bryan
   * @method getMemberCycleChamber - get the cycle chamber where the members belongs to
   * @param memberCode UID or Member ID
   * @param chamberObj the whole virtual chamber for specific levels
   */
  getMemberCycleChamber(memberCode, chamberObj) {
    const objIdx = chamberObj.findIndex(i => {
      let qryRes : any = i.memberList.find(e => e.uid === memberCode);
      if (qryRes) return chamberObj.indexOf(qryRes);
    });
    let cycleChamberObj = chamberObj[objIdx]; // return memberObj if found thus undefined if not
    return cycleChamberObj;
  }

  /**
   * @author Bryan
   * @method getMember get member object in the cycle chamber
   * @param memberCode UID or Member ID
   * @param cycleChamberObj Cycle Chamber Object it is the data retrieves from getMemberCycleChamber
   */
  getMember(memberCode, cycleChamberObj) {
    return cycleChamberObj.memberList.find(i => i.uid === memberCode);
  }

  /**
   * @author Bryan
   * @method processRecurChamber this recursive method process and handles 
   *                             all the movement in the virtual chamber, it move every member 
   *                             in the cycle 1 to 10 accordingly
   * @param chamberObj virtual chamber object
   * @param cycleTo cycle where the member should go
   * @param memberObj member object
   * 
   */
  processRecurChamber(chamberObj, cycleTo, memberObj) {
    if (chamberObj[cycleTo].cycleId > 0) { // not applicable for inactive chamber
      if (chamberObj[cycleTo].memberList.length >= this.CHAMBER_SIZE) { // chamber max limit? do the thing
        let recurPop = chamberObj[cycleTo].memberList.shift(); // pop the first item in the queue
        recurPop.currentCycle = String(cycleTo); // update the currentCycle in the member object
        chamberObj[cycleTo].memberList.push(memberObj); // push member in the designated chamber
        let recurCycle = cycleTo + 1; // we can do this way instead of ++cycleTo \_('_')_/
        this.processRecurChamber(chamberObj, recurCycle, recurPop); // let's do it again
      } 
      else if (chamberObj[cycleTo].cycleId >= 10 && chamberObj[cycleTo].memberList.length >= this.CHAMBER_SIZE ) {
        const vChamber = [
          'LVL_P300', 'LVL_P500', 'LVL_P1K', 'LVL_P5K',
          'LVL_P10K', 'LVL_P20K', 'LVL_P30K', 'LVL_EXIT'
        ];

        const currLvl = memberObj.currentLvl;
        const index = vChamber.indexOf(currLvl) > -1 ? vChamber.indexOf(currLvl) : 0;

        let recurPop = chamberObj[cycleTo].memberList.shift(); // pop the first item in the queue
        recurPop.currentCycle = String(1); // update the currentCycle in the member object
        recurPop.currentLvl = vChamber[index+1]; //update currentLvl
        
        if (vChamber[index+1] === 'LVL_EXIT') {
          this.transferExitChamber(recurPop);
        } else {
          this.transferLevelUpChamber(vChamber[index + 1], recurPop).pipe(
            take(1)
          ).subscribe(res => {
            const vChamberPayload = {members: res};
            this.chamberService.updateChamber(recurPop.currentLvl, vChamberPayload);
          });
        }
      }
      else { // nah? just push the member
        chamberObj[cycleTo].memberList.push(memberObj); 
      }
    }
  }

  transferLevelUpChamber(levelId, memberObj) {
    const transferSubj$ = new Subject<any>();
    this.chamberService.searchVirtualChamber(levelId).subscribe(data => {
      console.log('transfer',JSON.stringify(data.payload.data()));
      const lvlChamberObj : any = data.payload.data();
      let chamberObj = lvlChamberObj.members;

      this.processRecurChamber(chamberObj, 1, memberObj);
      transferSubj$.next(chamberObj);
    });

    return transferSubj$.asObservable();
  }

  transferExitChamber(memberObj) {
    this.chamberService.updateExitChamber('LVL_EXIT', memberObj);
  }
}

export class Featured {
    photoUrl: string;
}
