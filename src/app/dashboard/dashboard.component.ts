import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
// import { GuardServiceService } from './services/guard-service.service';
import { ApiService } from '../service/api/api.service';
import { menuList } from './layout/sidebar/menu-list-erp';
import { DataComService } from '../service/data-com/data-com.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mode: any;
  opened: any;
  position = 'start';
  currentUrl = '';
  tempDate = new Date();
  mediaQuery: any;
  @ViewChild('snav', { static: true }) mobileNavbar: any;
  menuList = menuList;
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.innerWidth = window.innerWidth;

  // }

  sidebarOpen = true;
  displayName: any = {};
  isOver: boolean = false;
  constructor(
    private media: MediaMatcher,
    private router: Router,
    private dataCom: DataComService,
    private api: ApiService
  ) {
    this.mediaQuery = media.matchMedia('(max-width: 900px)');
    // this.guardService.setDataValue(true);
  }

  ngOnInit() {
    if (this.mediaQuery.matches === true) {
      this.opened = true;
      this.mode = 'over';
      this.sidebarOpen = false;
    } else {
      this.opened = true;
      this.mode = 'side';
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event['url'];
        this.expandParent();
      }
    });
    this.instituteDisplay();
  }

  instituteDisplay() {
    this.api.get(`settings/institute?page=0&size=-1`).subscribe((response) => {
      if (response.data.data.length <= 1) {
        this.displayName.name = response.data.data[0].name_en;
        this.displayName.website_url = response.data.data[0].website_url;
        this.dataCom.setCurrentInstitute(response.data.data[0]);
      } else {
        this.displayName.name = 'School-Portal';
        this.displayName.website_url = '';
        this.dataCom.setCurrentInstitute({});
      }
    });
  }

  expandParent() {
    // this.menuList.map(item => {
    //   item["permissions"].map(data => {
    //     if (data.path == this.router.url) {
    //       item["isSelected"] = true;
    //       this.currentUrl = this.router.url;
    //       this.currentUrlId = data.id;
    //       return;
    //     }
    //   })
    //
    // });
  }

  navBarOpenEvent(event: { opened: boolean }): void {
    if (!this.mediaQuery.matches && event.opened === true) {
      if (this.opened === true) {
        this.opened = false;
      } else {
        this.opened = true;
      }
    } else if (this.mediaQuery.matches && event.opened === true) {
      this.opened = true;
      this.mobileNavbar.toggle();
    }
  }

  closeNavBar(event: { closeSideNav: boolean }): void {
    if (event.closeSideNav === true && this.mediaQuery.matches === true) {
      this.opened = true;
    }
  }

  navPosition(event: { toggleNav: boolean }): void {
    if (event.toggleNav === true) {
      if (this.position === 'start') {
        this.position = 'end';
      } else {
        this.position = 'start';
      }
    }
  }

  backdropCheck() {
    this.opened = false;
  }
}
