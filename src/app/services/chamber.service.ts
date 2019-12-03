import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

/**
 * @author Bryan Judelle Ramos
 */
@Injectable()
export class ChamberService {

    chamber: any;
    virtualChamber$;
    constructor(private db: AngularFirestore) {}


    /**
     * @member fetchVirtualChamberData
     * @description API for fetching all virtual chamber records
     */
    fetchVirtualChamberDataAPI() {
        return this.db.collection('virtualChamber').snapshotChanges();
    }

    generateGenesisChamber(docId: string) {
        if (!docId) {
            docId = "LVL_P300";
        }
        let genesisChamber = {members: []};

        for (let i = 0; i <= 10; i++) {
            const obj = {cycleId: 0,memberList: []}
            obj.cycleId = i;
            genesisChamber.members.push(obj);
        }
        console.log("genesisChamber", JSON.stringify(genesisChamber));
        return this.db.collection('virtualChamber').doc(docId).set(genesisChamber);
    }

    updateVirtualChamber(docId: string, chamberPayload) {
        if (!docId) {
            docId = 'LVL_P300'
        }
        let genesisChamber = {members: chamberPayload};

        console.log("updatedChamber", JSON.stringify(genesisChamber));
        this.db.collection('virtualChamber').doc(docId).set(genesisChamber);
    }


    updateChamber(docId, data) {
        this.db.doc('virtualChamber/' + docId).update(Object.assign({}, data));
    }

    updateExitChamber(docId, data) {
        this.db.doc('exitChamber/' + docId).update(Object.assign({}, data));
    }

    searchVirtualChamber(docId) {
        return this.db.collection('virtualChamber').doc(docId).snapshotChanges();
    }


}
