import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';

/**
 * @author Bryan
 * @description Utility Service Class for membership code/upline code.
 */


@Injectable()
export class UtilsService {

    private utilsURL = AppConstants.BASE_API_URL + '/utils';
    private secUtils = AppConstants.BASE_API_URL + '/api/';

    private headers = {
      'Content-Type':'application/json',
      'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
    }

    constructor(private http: HttpClient) {}

    getMemberCodeList(): Observable<any> {
        return this.http.get(this.utilsURL + '/get-membercode');
    }

    getVirtualChamberReport(): Observable<any> {
        return this.http.get(this.secUtils + '/get-virtualChamberReport', {headers : this.headers});
    }


}
