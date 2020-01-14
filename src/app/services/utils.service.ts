import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Code } from '../model/code.model';
import { Subject, Observable } from 'rxjs';
import { debounceTime, take, map } from 'rxjs/operators';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';

/**
 * @author Bryan
 * @description Utility Service Class for membership code/upline code.
 */
const M = 'memberCode';

@Injectable()
export class UtilsService {

    private purseUrl = AppConstants.BASE_API_URL + '/utils';

    private headers = {
      'Content-Type':'application/json',
      'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
    }

    memberCode: any;
    constructor(private db: AngularFirestore,
        private http: HttpClient) {}

    /**
     *  Membership Code API's segment
     */
    generateMembersCode(code) {
        return this.db.collection('memberCode').add(code);
    }

    getGeneratedCode() {
        return this.db.collection('memberCode').snapshotChanges();
    }

    searchCode(code) {
        return this.db.collection('memberCode', ref => ref.where('code', '==', code)).snapshotChanges();
    }

    validateCode(control: any) {
        return this.db.collection('memberCode', ref => ref.where('code', '==', control.value))
          .snapshotChanges().pipe(
          debounceTime(500),
          take(1),
          map(res => 
            {
              console.log(res);
              let docId;
              if(res.length>0) {
                docId = res[0].payload.doc.id;
                return  { 'docId': docId };
              } else {
                return  { 'isUsed': true};
              }
            } 
          )
        )
    }

    updateGeneratedCode(memCode: Code) {
        this.db.doc('memberCode/' + memCode.docId).update(memCode);
    }

    generate() {
        for (let i = 0; i <= 5; i++) {
            this.memberCode = {
                code: Math.random().toString(36).substring(7),
                isUsed: false
            };
            this.generateMembersCode(this.memberCode).then(e => {
                console.log('res', e);
            }).catch(error => {
                console.log('error', error);
            });
        }
    }


    /**
     *  Upline Code Lookup API's segment
     */

    addUplineLookUp(upline) {
        return this.db.collection('uplineLookup').add(upline);
    }

    getUplineLookUpList() {
        return this.db.collection('uplineLookup').snapshotChanges();
    }

    searchUpline(uplineCode) {
        return this.db.collection('uplineLookup', ref => ref.where('uplineCode', '==', uplineCode)).snapshotChanges();
    }

    /**
    *  Members API's service implementation segment
    */
    validateMembershipCode(code): Observable<any> {
        const subj = new Subject<any>();
        this.searchCode(code).subscribe(e => {
        const response = e.map(obj => ({docId: obj.payload.doc.id,
            ...obj.payload.doc.data()} as Code));
            if (response[0]) {
                if (response[0].isUsed) {
                    subj.next({ message: 'code is already used.', isUsed: true, codeObj: response });
                } else {
                    subj.next({ message: 'code is valid.', isUsed: false, codeObj: response });
                }
            } else {
                subj.next({ message: 'Invalid membership code.', isUsed: true, codeObj: response });
            }
        });

        return subj.asObservable();
    }

    // new backend implementation
    getMemberCodeList(): Observable<any> {
        return this.http.get(this.purseUrl + '/get-membercode');
    }

}
