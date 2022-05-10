import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api/api.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';

@Component({
  selector: 'app-institutional-settings',
  templateUrl: './institutional-settings.component.html',
  styleUrls: ['./institutional-settings.component.scss']
})
export class InstitutionalSettingsComponent implements OnInit {
  currentSessionId: number = 0;
  currentSession: any
  sessionDropdown: any[] = [];
  subscriptionList: Array<Subscription> = [];

  constructor(
    private api: ApiService,
    private sessData: SessionDataPassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSessionDropdown();
  }
  ngOnDestroy(){
    this.subscriptionList.forEach(subs => subs.unsubscribe());
  }

  getSessionDropdown(){
    this.api.get('settings/session?page=0&size=-1').subscribe((response: any) => {
      this.sessionDropdown = response?.data?.data;
    })
  }

  buttonClicked(control: number){
    let currentIndex: number = this.sessionDropdown.indexOf(this.sessionDropdown.find((sess: any, i: number) => sess.id === this.currentSessionId));
    if(control > 0){
      currentIndex = currentIndex === this.sessionDropdown.length - 1 ? 0 : currentIndex + 1;
    }else if(control < 0){
      currentIndex = currentIndex === 0 ? this.sessionDropdown.length - 1 : currentIndex - 1;
    }
    this.currentSessionId = this.sessionDropdown[currentIndex]?.id;
    this.setSessionData()
  }

  setSessionData(){
    this.sessData.setSession(this.currentSessionId);
  }

}
