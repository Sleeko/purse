import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

/**
 * @author Bryan Judelle Ramos
 */
@Injectable({
    providedIn: 'root'
})
export class ChamberService {

    chamber: any;
    virtualChamber$;
    chamberSubject = new Subject<any>();
    constructor(private db: AngularFirestore) {
        // 1.) get all data from firestore
        this.fetchVirtualChamberDataAPI().subscribe(data =>  {
            const r = data.map(e => ({
                id: e.payload.doc.id,
                ...e.payload.doc.data()
            }));
            this.chamberSubject.next(r);
        });
        // 4.)
        this.initData();
    }

    // 3.) initialize data and passed it to class property
    initData() {
        this.parseAsObservable().subscribe(obj => this.chamber = obj);
    }

    // 2.) subroutine for getting the data
    parseAsObservable() {
        return this.chamberSubject.asObservable();
    }

    // 5.) final output data
    getChamber() {
        return this.chamber;
    }

    /**
     * @member fetchVirtualChamberData
     * @description API for fetching all virtual chamber records
     */
    fetchVirtualChamberDataAPI() {
        return this.db.collection('virtualChamber').snapshotChanges();
    }

    getVirtualChamberData() {
        this.fetchVirtualChamberDataAPI().subscribe(data => {
            const dataMap = data.map(e => ({id: e.payload.doc.id,
                ...e.payload.doc.data()}));

            console.log('dataMap', dataMap);
        });

        return this.chamber;
    }

}
