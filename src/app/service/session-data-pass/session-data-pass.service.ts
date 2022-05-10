import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionDataPassService {
  private _sessionData = new BehaviorSubject<any>(0);
  getSession = this._sessionData.asObservable();
  setSession(val: any){
    this._sessionData.next(val);
  }

  constructor() { }
}
