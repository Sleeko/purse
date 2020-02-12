import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

/**
 * @author Bryan Judelle Ramos
 */
@Injectable()
export class ChamberService {

    chamber: any;
    virtualChamber$;

    private url = AppConstants.BASE_API_URL + "/api";
    private headers = {
        'Content-Type':'application/json',
        'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
    }

    constructor(private http: HttpClient) {}

    getMemberChamber(): Observable<any> {
        return this.http.get(this.url + '/get-memberChamber', {headers : this.headers});
    }

}
