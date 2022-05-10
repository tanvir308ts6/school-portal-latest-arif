import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../storage/storage.service";
import {environment} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {HelperService} from "../helper/helper.service";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  private asyncCurrentMenu = new Subject<any>();
  private syncCurrentMenu: any;

  getCurrentMenu = this.asyncCurrentMenu.asObservable();

  constructor() {
  }

  public setCurrentMenu(val: any){
    this.asyncCurrentMenu.next(val);
    this.syncCurrentMenu = val;
  }

  public get currentMenu(){
    return {
      menu: this.syncCurrentMenu,
      path: `../../../../${environment.asset_prefix}assets/images/`,
    };
  }

}
