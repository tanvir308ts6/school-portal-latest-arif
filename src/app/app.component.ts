import { Component } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { ApiUrlService } from './service/api-url/api-url.service';
import { menuList as menuListLMS } from './dashboard/layout/sidebar/menu-list-erp';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'school-portal-latest';
  currentMenu: any = {};

  constructor(private router: Router, private urlMenu: ApiUrlService) {
    this.router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        this.getCurrentMenuThroughUrl(
          {
            to_path:
              events[1].urlAfterRedirects.split(';')[0] ??
              events[1].urlAfterRedirects,
            from_path:
              events[0].urlAfterRedirects.split(';')[0] ??
              events[0].urlAfterRedirects,
          },
          menuListLMS,
          0
        );
      });
  }

  getCurrentMenuThroughUrl(
    { to_path, from_path }: { to_path: string; from_path: string },
    tempMenuList: any,
    found: number
  ) {
    if (from_path !== to_path) {
      tempMenuList.some((data1: any) => {
        if (
          data1.path != from_path &&
          from_path.startsWith(data1.path) &&
          'permissions' in data1
        ) {
          this.getCurrentMenuThroughUrl(
            { to_path: to_path, from_path: from_path },
            data1.permissions,
            found
          );
          return found === 2;
        } else if (
          data1.path != to_path &&
          to_path.startsWith(data1.path) &&
          'permissions' in data1
        ) {
          data1.exp = true;
          this.getCurrentMenuThroughUrl(
            { to_path: to_path, from_path: from_path },
            data1.permissions,
            found
          );
          return found === 2;
        } else if (data1.path == from_path && !('permissions' in data1)) {
          data1.exp = false;
          this.urlMenu.setCurrentMenu(data1);
          found++;
          return found === 2;
        } else if (data1.path == to_path && !('permissions' in data1)) {
          data1.exp = true;
          this.urlMenu.setCurrentMenu(data1);
          found++;
          return found === 2;
        } else {
          data1.exp = false;
          this.urlMenu.setCurrentMenu({});
          return false;
        }
      });
    }
  }
}
