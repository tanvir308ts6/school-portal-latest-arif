import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderStatus = new Subject<boolean>();

  private submissionStatus = new Subject<boolean>();

  private asyncSentData = new Subject<any>();

  private syncData: any = null;

  loaderControl = this.loaderStatus.asObservable();

  submissionControl = this.submissionStatus.asObservable();

  asyncDataControl = this.asyncSentData.asObservable();

  constructor() {
  }

  public setLoaderStatus(val: boolean){
    this.loaderStatus.next(val);
  }

  public setSubmissionStatus(val: boolean){
    this.submissionStatus.next(val);
  }

  public setAsyncData(val: any){
    this.asyncSentData.next(val);
  }

  public setSyncData(val: any){
    this.syncData = val;
  }

  public getSyncData(){
    return this.syncData;
  }

  public ggggetteSync(): Observable<any>{
    return of({
      id: 1,
      name: 'Jasmin',
      sex: 'Male'
    });
  }

}
