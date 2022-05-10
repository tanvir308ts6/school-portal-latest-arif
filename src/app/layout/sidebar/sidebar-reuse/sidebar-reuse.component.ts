import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-sidebar-reuse',
  templateUrl: './sidebar-reuse.component.html',
  styleUrls: ['./sidebar-reuse.component.scss']
})
export class SidebarReuseComponent implements OnInit {

  @Input() dataList: any;
  @Input() sidebarTog: any;
  @Input() mouseIsOver: any;
  @Input() mainDataList: any;
  // private menuList = menuList;
  public imgUrl: string = `../../../${environment.asset_prefix}assets/images/`;
  public routeUrl: string = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  stateChange(data: any, index?: number) {
    if (data['tog'] && index) {
    } else if (data.path.includes('http')) {
      window.open(data['path']);
    } else {
      this.router.navigate([`${data['path']}`]);
      this.setAllNotToggleExp(this.mainDataList);
      data.exp = true;
    }
  }

  stateChangeForNewTab(event: any, data: any, index?: any){
    event.preventDefault();
    window.open(data['path']);
  }

  changeExp(data: any, state: string) {
    state == 'Open'
      ? (data.exp = true)
      : state == 'Close'
      ? (data.exp = false)
      : '';
  }

  setAllNotToggleExp(tempList: any) {
    tempList.forEach((data: any) => {
      if (data.tog) {
        this.setAllNotToggleExp(data.permissions);
      } else {
        data.exp = false;
      }
    });
  }

  generateSidebarIconPath(data: any){
    let tempIconParent = data?.path?.split('/')[2] ? (data?.path.includes(':') ? 'hr-management' : data?.path?.split('/')[2]) : data?.path?.split('/')[1];
    return `${this.imgUrl}${tempIconParent}/${data.icon}`;
  }

}
