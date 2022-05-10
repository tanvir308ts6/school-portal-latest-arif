import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-offered-class-details',
  templateUrl: './offered-class-details.component.html',
  styleUrls: ['./offered-class-details.component.scss'],
})
export class OfferedClassDetailsComponent implements OnInit {
  offered_class: any;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sesPa: SessionDataPassService
  ) {
    this.sesPa.getSession.subscribe((sess: number) => {
      if(sess){
        this.getOfferedClassDropdown(sess)
      }
    });
  }

  offeredClassDropdown: any[] = [];

  getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      this.offered_class = this.offeredClassDropdown.find((sub: any) => {
        return sub?.id === Number(params.get('id'));
      });
    });
  }

  changeRoute() {
    this.offered_class?.id
      ? this.router.navigate([
          '/dashboard/class-management/class-details',
          { id: this.offered_class?.id },
        ])
      : this.router.navigate(['/dashboard/class-management/class-details']);
  }

  ngOnInit(): void {
  }

  getOfferedClassDropdown(session_id: number) {
    let url: string = session_id
      ? `class/offered-class?page=0&size=1&search=${this.api.getSearchData({
          session_id: session_id,
        })}`
      : 'class/offered-class?page=0&size=1';
    this.api.get(url).subscribe((response: any) => {
      this.offeredClassDropdown = response?.data?.data;
      this.getRouteParameters();
    });
  }

  reRouteToUrl(url: string, params?: any){
    if(params){
      this.router.navigate([`dashboard/class-management/${url}`, params]);
    }else{
      this.router.navigate([`dashboard/class-management/${url}`, {id: this.offered_class?.id}]);
    }
  }
}
