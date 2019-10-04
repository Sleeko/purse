import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurseService {

  private purseUrl = AppConstants.BASE_API_URL + '/purse';
  
  constructor(private http: HttpClient) { }

  getPurses(memberId: number): Observable<any> {
    return this.http.get(this.purseUrl + '?memberId='+ memberId);
  }
}
