import { Injectable } from '@angular/core';
import { Member } from '../model/member.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<Member[]>('../json/member.json');
  }
}
