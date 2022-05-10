import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private baseUrl: string;
  private apiUrl: string;

  constructor() {
    this.baseUrl = environment.base_url;
    this.apiUrl = environment.api_url;
  }

  // @ts-ignore
  public getAuthHeader() {
    let token = window.localStorage.getItem('accessToken');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token);
    if (headers) {
      return headers;
    }
  }
}
