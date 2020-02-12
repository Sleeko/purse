import { Injectable } from '@angular/core';
import { Store } from '../model/store.model';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { HttpResponse } from '../model/http-response.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private url = AppConstants.BASE_API_URL;
  private headers = {
    'Content-Type':'application/json',
    'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
  }
  constructor(
    private http : HttpClient
  ) { }

  createNewStore(store : Store){
    return this.http.post<HttpResponse>(this.url + '/api/admin/create-store', store, {headers : this.headers})
  }

  getAllStores(){
    return this.http.get<Store[]>(this.url + '/api/admin/list-store', {headers : this.headers});
  }

  updateStore(store: Store){
    return this.http.put<HttpResponse>(this.url + '/api/admin/update-store', store , {headers: this.headers});
  }

  deleteStore(store: Store){
    return this.http.delete<HttpResponse>(this.url + '/api/admin/delete-store/' + store.id, {headers : this.headers});
  }

}
