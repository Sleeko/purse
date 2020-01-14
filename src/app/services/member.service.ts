import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { VirtualChamber } from '../model/virtual-chamber.model';
import { Subject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  CAPACITY: number  = AppConstants.CHAMBER_CAPACITY * 10;

  private purseUrl = AppConstants.BASE_API_URL + '/api/admin';

    private headers = {
      'Content-Type':'application/json',
      'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
    }

  constructor(private db: AngularFirestore,
    private http: HttpClient) { }

  public async getMemberSessData() {
    return await sessionStorage.getItem('userInfo');
  }

  getMembers() {
    const list$ = new Subject<any>();

    this.db.collection('userInfo')
    .snapshotChanges()
    .subscribe(data => {
      const rawList : any = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() })); 
      console.log('rawList', JSON.stringify(rawList));
      const list = [];
      for (let u of rawList) {
        const user = {
          memberName: this.nullChecker(u.personalInfo),
          role: u.role
        }
        list.push(user);
      }

      list$.next(list);

    });

    return list$.asObservable();
  }

  nullChecker(value) {
    
    let firstname, lastname;
    if (value) {
      if (value.firstName) {
        firstname = value.firstName
      } else {
        firstname = "User's Profile";
      }
  
      if (value.lastName) {
        lastname = value.lastName
      }
      else {
        lastname = "not yet COMPLETE";
      }
    } else {
      firstname = "User's Profile";
      lastname = "not yet COMPLETE"
    }
    
    return firstname + " " + lastname;
  }

  // optimized later
  searchMemberCycle(uid) {
    const member$ = new Subject<any>();
    this.db.collection('virtualChamber')
      .snapshotChanges()
      .subscribe(data => {
        const virtualChamber : any = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() }) as VirtualChamber); 
        const vChamber = virtualChamber.find(i => {
          const idx = i.members.some(x => {
              let srcQry = x.memberList.find(e => e.uid === uid);
              if (srcQry) return x;
          });
          return idx ? idx : null;
        });
        let chamberObj = vChamber.members;

         const objId = chamberObj.findIndex(i => {
          let qry : any = i.memberList.find(e => e.uid === uid);
          if (qry) return chamberObj.indexOf(qry);
        });
        
        let cycleChamberObj = chamberObj[objId];
        const memberCycleObj : any = cycleChamberObj.memberList.find(i => i.uid === uid);
        const responseObj = {level: memberCycleObj.currentLvl, memberCycle: memberCycleObj };
        member$.next(responseObj);
      });
    return member$.asObservable();
  }


  getVirtualChamberStatus() {
    const virChmObj = new Subject<any>();
    this.db.collection('virtualChamber')
      .snapshotChanges()
      .pipe(take(7))
      .subscribe(data => {
        const virtualChamber = data.map(e => ({ 
          id: e.payload.doc.id, 
          ...e.payload.doc.data() 
        }) as VirtualChamber);

        const ARR_MAP = [
          'LVL_P300', 'LVL_P500', 'LVL_P1K', 'LVL_P5K',
          'LVL_P10K', 'LVL_P20K', 'LVL_P30K',
        ];

        let accumulator = [];
        for (let obj of ARR_MAP) {
            const vcObj = virtualChamber.find(i => i.id === obj);
            const total = vcObj.members.reduce((t,i) => {
                if (i.cycleId > 0) {
                  return t + i.memberList.length;
                }
                return t + 0;
            }, 0);
            const pushObj = {
              id: obj, 
              count: total, 
              capacity: this.CAPACITY,
              usage: (total / this.CAPACITY) * 100
            };
            accumulator.push(pushObj);
        }
        virChmObj.next(accumulator);
    });

    return virChmObj.asObservable();
  }


  // new backend implementation
  getUserInfoCounter() {
    return this.http.get(this.purseUrl + '/get-userInfoCounter', {headers: this.headers});
  }

  getAllUser(): Observable<any> {
    return this.http.get(this.purseUrl + '/get-allUsers', {headers: this.headers} );
  }

  getVirtualChamberUser(): Observable<any> {
    return this.http.get(this.purseUrl + '/get-chamberUser', {headers: this.headers} );
  }
}
