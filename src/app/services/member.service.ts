import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { VirtualChamber } from '../model/virtual-chamber.model';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private db: AngularFirestore) { }

  public async getMemberSessData() {
    return await sessionStorage.getItem('userInfo');
  }

  getAdminMember() {
    const admin$ = new Subject<any>();
    this.db.collection('userInfo')
      .snapshotChanges()
      .subscribe(data => {
        const rawList : any = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() })); 
        const adminList = rawList.map(o => {
          if (['admin','staff','dept_head'].indexOf(o.role) > -1) {
            return o;
          };
        }).filter(x => x);
        admin$.next(adminList);
      });
    return admin$;
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

  getUserInfoCount() {
    const countObj = new Subject<any>();
    this.db.collection('virtualChamber')
      .snapshotChanges()
      .pipe(take(7))
      .subscribe(data => {
        const virtualChamber = data.map(e => ({ 
          id: e.payload.doc.id, 
          ...e.payload.doc.data() 
        }) as VirtualChamber);

        const activeMemberCounter = virtualChamber.reduce((s, e) => {
          return s + e.members.reduce((t, i) => {
            if (i.cycleId > 0) {
              return t + i.memberList.length;
            } else {
              return t + 0;
            }
          }, 0);
        }, 0);

        const defaultChamber = virtualChamber.find(i => i.id === 'LVL_P300');
        const inactiveMemberCounter = defaultChamber.members.reduce( (total = 0, i) => {
          if (i.cycleId !== 0) {
            return total + i.memberList.length
          }
        }, 0);

        const resObj = {
          membersCount: activeMemberCounter + inactiveMemberCounter,
          inactiveMembers: inactiveMemberCounter,
          activeMembers: activeMemberCounter,
          profit: 300 * (activeMemberCounter + inactiveMemberCounter)
        };

        countObj.next(resObj);
    });

    return countObj.asObservable();
  }
}
