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
import { ChamberMember } from '../../model/chamber-member.model';
import { UserInfo } from '../../model/user-info.model';
import * as firebase from 'firebase/app';


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
  data: any;
  accountResponse: any;

  docId: any;

  chamber: any;

  chamber_length: number = 1;
  chamberSubj;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private utilsService: UtilsService,
              private chamberService: ChamberService,
              public db: AngularFirestore,
              public router: Router) {
                this.chamberSubj = new Subject<any>();
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
    // this.chamberService.generateGenesisChamber("LVL_P300").then(e => {
    //   console.log('success', e);
    // }).catch(e => {
    //   console.log('error', e);
    // })
    // this.processChamberCycle('test', 'NEW').subscribe(res => {
    //   console.log('subj-observable', JSON.stringify(res));
    //    this.chamberService.updateVirtualChamber('LVL_P300', chamberObj).then(res => {
    //     console.log("updating chamber..", res);
    //  }).catch(err => {
    //    console.log('error updating chamber:',err)
    //  })
    // });
    
  
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
                  //this.processChamberCycle(control.value, 'MOVE');
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
    console.log(c);
    if (c.get('password').value !== c.get('confirm_password').value) {
      return { invalid: true };
    }
  }

  /**
   * 
   * 
   */
  register(formData) {

    console.log('formData', JSON.stringify(formData));
    const req = {
      email: formData.email,
      code: formData.code,
      referrerCode: formData.referrerCode,
      password: formData.passwords.password,
    };

    const payload = { email: req.email, password: req.password };
    this.tryRegister(payload, req);
  }

  // sub-routine method for registration
  tryRegister(payload, req) {
    this.authService.doRegister(payload)
      .then(res => {
        console.log('Account ID', res.user.uid);
        const userInfoPayload = {
          uid: res.user.uid,
          email: res.user.email,
          personalInfo: {},
          accountInfo: {},
          governmentDocuments: {},
          dateRegistered: firebase.firestore.FieldValue.serverTimestamp(),
          role: 'member'
        };

        // const userInfo = new UserInfo();
        // userInfo.uid = res.user.uid;
        // userInfo.email = res.user.email;
        // userInfo.dateRegistered = new Date();
        // userInfo.role = 'member';
        // saving uer data
        this.userService.saveUserInfo(userInfoPayload).then(data => {
          console.log('account creation', data);
          // payload for upline lookup
          const uplinePayload = {
            memberId: userInfoPayload.uid,
            uplineCode: req.referrerCode,
            dateRegistered: new Date()
          };

          // add to upline lookup
          this.utilsService.addUplineLookUp(uplinePayload).then(e => {
            console.log('add upline lookup', JSON.stringify(e));
          }).catch(err => {
            console.log('add upline lookup error', JSON.stringify(err));
          });

          // activate chamber
          this.processChamberCycle(userInfoPayload.uid, 'NEW').subscribe(res => {
            console.log('subj-observable', JSON.stringify(res));
             //this.chamberService.updateVirtualChamber('LVL_P300', res);
             this.chamberService.updateChamber(res);
          });

        }).catch(error => {
          console.log('error', error);
        });

        const payloadMCode = {
          docId: this.docId,
          code: req.code,
          isUsed: true
        } as Code;
    
        this.utilsService.updateGeneratedCode(payloadMCode);
      }, err => {
        console.log(err);
        console.log(err.message);
        alert(err.message);
      },);
    console.log('data', this.data);
  }

  processChamberCycle(memberCode, activity) {
    const subj = new Subject<any>();
    this.chamberService.fetchVirtualChamberDataAPI().subscribe(data => {
      let r = data.map(e => ({
                id: e.payload.doc.id,
                ...e.payload.doc.data()
            }) as VirtualChamber);
            console.log("fetch", JSON.stringify(r));
      let chamberObj = r[0].members; // main chamber object

     switch (activity) {
        case 'NEW':
          chamberObj[0].memberList.push({uid: memberCode, currentCycle: "INACTIVE"});
          console.log('entered new case');
          break;

        case 'MOVE':
            console.log('entered move case');
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

     console.log('chamberObject', JSON.stringify(chamberObj));
     subj.next(chamberObj);

    });

    return subj.asObservable();
  }

  getMemberCycleChamber(memberCode, chamberObj) {
    const objIdx = chamberObj.findIndex(i => {
      let qryRes : any = i.memberList.find(e => e.uid === memberCode);
      if (qryRes) return chamberObj.indexOf(qryRes);
    }); // fetching the position of member in the chamber cycle (member code)
    let memberObj = chamberObj[objIdx]; // return memberObj if found thus undefined if not
    console.log('member-obj',memberObj);
    return memberObj;
  }

  getMember(memberCode, chamberCycleObj) {
    return chamberCycleObj.memberList.find(i => i.uid === memberCode);
  }

  processRecurChamber(chamberObj, cycleTo, memberObj) {
    if (chamberObj[cycleTo].cycleId > 0) { // not applicable for inactive chamber
      if (chamberObj[cycleTo].memberList.length >= this.chamber_length) {
        let recurPop = chamberObj[cycleTo].memberList.shift();
        recurPop.currentCycle = String(cycleTo);
        chamberObj[cycleTo].memberList.push(memberObj);
        let recurCycle = cycleTo + 1; // we can do this way instead of ++cycleTo
        this.processRecurChamber(chamberObj, recurCycle, recurPop); // let's do it again
      } 
      else {
        chamberObj[cycleTo].memberList.push(memberObj);
      }
    }
  }

}

export class Featured {
    photoUrl: string;
}
