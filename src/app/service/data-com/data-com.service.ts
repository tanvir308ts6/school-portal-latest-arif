import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataComService {

  public passedItemData = new BehaviorSubject<any>('');
  getPassedItemData = this.passedItemData.asObservable();

  private _currentInstitute: any;
  get currentInstitute(){
    return this._currentInstitute;
  }
  setCurrentInstitute(data: any){
    this._currentInstitute = data;
  }

  constructor() {
  }

  setPassedItemData(data: any) {
    this.passedItemData.next(data);
  }

  checkLogged = () => {
    if (localStorage.getItem('accessToken')) {
      const token = localStorage.getItem('accessToken');
      // return !this.jwtHelper.isTokenExpired(token);
      return true;
    }else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    return true;
  }

  async modifyStyleClass(class_name: string, image_name: string){
    let target_class: any = await window.document.getElementsByClassName(class_name);
    for(let i=0;i<target_class.length;i++){
      target_class[i].style.backgroundImage = `url('../../../${environment.asset_prefix}assets/images/${image_name}')`;
    }
  }
}
