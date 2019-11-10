import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Code } from '../model/code.model';

/**
 * @author Bryan
 * @description Utility Service Class for generating members code.
 */
const M = 'memberCode';

@Injectable()
export class UtilsService {
    memberCode: any;
    constructor(private db: AngularFirestore) {}

    generateMembersCode(code) {
        return this.db.collection('memberCode').add(code);
    }

    getGeneratedCode() {
        return this.db.collection('memberCode').snapshotChanges();
    }

    searchCode(code) {
        return this.db.collection('memberCode', ref => ref.where('code', '==', code)).snapshotChanges();
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
}
