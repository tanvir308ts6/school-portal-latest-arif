import { MediaMatcher } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  dashboard: any;
  mediaQuery: any;
  currentUser: any;
  // menuList: any[] = [];
  reloadUrl = '';
  currentUrlId: any;
  authData = {};
  panelOpenState: any[] = [];

  @Input() menuContentToggle: any;
  @Input() displayName: any;
  @Input() mouseIsOver: any;
  @Input() menuList: any;
  @Input() sidebar_header: string = '';
  @Output() closeNavBar = new EventEmitter<any>();

  constructor(private media: MediaMatcher, private router: Router) {
    // this.mediaQuery = media.matchMedia('(max-width: 900px)');
    // @ts-ignore
    // this.menuList = menuList;
    this.dashboard = this.menuList;
  }

  get curentUser(): any{
    return JSON.parse(window.localStorage.getItem('currentUser') ?? '');
  }

  ngOnInit() {
    this.reloadUrl = this.router.url.split(';')[0] ?? this.router.url;
    this.setMenuTree(this.menuList , 1);
    this.currentUser = window.localStorage.getItem('currentUser');
    if (this.currentUser !== null) {
      this.currentUser = JSON.parse(this.currentUser)
    }
  }

  setMenuTree(data: any[], position: number) {
    data.forEach((child) => {
      child.positionInTree = position;
      if (child.path != '/') {
        if (child.permissions && this.reloadUrl.startsWith(child.path)) {
          child.exp = true;
        } else if (!child.permissions && this.reloadUrl == child.path) {
          child.exp = true;
        } else {
          child.exp = false;
        }
      }
      if (child['permissions']) {
        child.tog = true;
        this.setMenuTree(child['permissions'], (position+1));
      } else {
        child.tog = false;
      }
    });
  }

  handleSideNav(): void {
    if (this.mediaQuery) {
      this.closeNavBar.emit({ closeSideNav: true });
    }
  }

  get self() {
    return this;
  }

  redirectToHome(){
    window.location.replace(`${environment.web_portal_url}${this.currentUser?.institute?.short_name}`);
  }

  logout(): void {}

}
