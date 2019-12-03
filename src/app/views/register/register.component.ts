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

  imgags: any[] = [
    {
      photoUrl: "https://picsum.photos/id/237/200/322"
    },
    {
      photoUrl: "https://picsum.photos/id/222/200/312"
    },
    {
      photoUrl: "https://picsum.photos/id/236/200/324"
    },
    {
      photoUrl: "https://picsum.photos/id/235/200/342"
    },
    {
      photoUrl: "https://picsum.photos/id/234/200/325"
    },
    {
      photoUrl: "https://picsum.photos/id/324/200/352"
    },
    {
      photoUrl: "https://picsum.photos/id/232/200/315"
    }
  ];

  test: string[] = ['asdasdasdasdasd', '12312312312312312', 'zxc123zxc123zxcasd123'];
  carouselItems: Observable<Featured[]>;
  registerFormGroup: FormGroup;
  listOfCode: any[];
  isSeller: boolean = true;
  docId: any;
  CHAMBER_SIZE: number = 10;
  CONFIG_CHAMBER_SIZE: any;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private utilsService: UtilsService,
              private chamberService: ChamberService,
              public db: AngularFirestore,
              public router: Router) {
              }

  ngOnInit() {
    this.carouselItems = interval(500).pipe(
      startWith(-1),
      take(10),
      map(val => {
        const i = 0;
        const data = this.imgags;
        return data;
      })
    );
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
      isSeller: [
        1
      ],
      passwords: this.formBuilder.group({
          password: ['', [Validators.required]],
          confirm_password: ['', [Validators.required]],
      }, {validator: this.passwordConfirming})
    });
    this.registerFormGroup.get('isSeller').valueChanges.subscribe(data => { data === 1 ? this.isSeller = true : this.isSeller = false; });
  }

  // WARNING!!! for development purposes. clear virtual chamber data 
  generateNewChamber() {
    this.chamberService.generateGenesisChamber('LVL_P300').then(e => {
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
          governmenDocuments: {},
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
      let r = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() }) as VirtualChamber);    
      let chamberObj = r[0].members;

     switch (activity) {
      case 'NEW':
        chamberObj[0].memberList.push({uid: memberCode, currentCycle: "INACTIVE"});
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
   * @method processRecurChamber this recursive method, process and handles 
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
        chamberObj[cycleTo].memberList.push(memberObj); // push member in the designated chamnber
        let recurCycle = cycleTo + 1; // we can do this way instead of ++cycleTo \_('_')_/
        this.processRecurChamber(chamberObj, recurCycle, recurPop); // let's do it again
      } 
      else { // nah? just push the member
        chamberObj[cycleTo].memberList.push(memberObj); 
      }
    }
  }
}

export class Featured {
    photoUrl: string;
}
