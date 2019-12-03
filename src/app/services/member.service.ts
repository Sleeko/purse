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

  // optimized later
  searchMemberCycle(uid) {
    const member$ = new Subject<any>();
    this.db.collection('virtualChamber')
      .snapshotChanges()
      .subscribe(data => {
        const virtualChamber = data.map(e => ({ id: e.payload.doc.id, ...e.payload.doc.data() }) as VirtualChamber); 
        const chamberObj : any = virtualChamber[0].members
        const objId = chamberObj.findIndex(i => {
          let qry : any = i.memberList.find(e => e.uid === uid);
          if (qry) return chamberObj.indexOf(qry);
        });
        
        let cycleChamberObj = chamberObj[objId];
        const memberCycleObj = cycleChamberObj.memberList.find(i => i.uid === uid);
        const responseObj = {level: virtualChamber[0].id, memberCycle: memberCycleObj };
        member$.next(responseObj);
      });
    return member$.asObservable();
  }

  getUserInfoCount() {
    const countObj = new Subject<any>();
    this.db.collection('virtualChamber')
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(data => {
        const virtualChamber = data.map(e => ({ 
          id: e.payload.doc.id, 
          ...e.payload.doc.data() 
        }) as VirtualChamber);
        
        const activeMemberCounter = virtualChamber[0].members.reduce( (total = 0, i) => {
          if (i.cycleId !== 0) {
            return total + i.memberList.length
          }
        }, 0);

        const inactiveMemberCounter = virtualChamber[0].members[0].memberList.length;

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
