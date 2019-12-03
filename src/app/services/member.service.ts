import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { VirtualChamber } from '../model/virtual-chamber.model';
import { Subject } from 'rxjs';

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
        const chamberObj = virtualChamber[0].members
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
}
