import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-class-section-details',
  templateUrl: './class-section-details.component.html',
  styleUrls: ['./class-section-details.component.scss']
})
export class ClassSectionDetailsComponent implements OnInit {
  offered_section: any;
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
    this.sesPa.getSession.subscribe((sess: number) =>
      this.getOfferedClassDropdown(sess)
    );
  }

  offeredSectionDropdown: any[] = [];
  offeredClassDropdown: any[] = [];

  getRouteParameters() {
    let subscription = new Subscription;
    subscription = this.route.paramMap.subscribe((params) => {
      this.offered_section = this.offeredSectionDropdown.find((sub: any) => {
        return sub?.id == params.get('id');
      });
    });
    subscription.unsubscribe();
  }

  changeRoute() {
    this.offered_section?.id
      ? this.router.navigate([
          '/dashboard/class-management/class-section-details',
          { id: this.offered_section?.id },
        ])
      : this.router.navigate(['/dashboard/class-management/class-section-details']);
  }

  ngOnInit(): void {
  }

  getOfferedSectionDropdown(offered_class_id: number) {
    this.api
      .get(
        `class/offered-section?page=0&size=1&search=${this.api.getSearchData({
          offered_class_id: offered_class_id,
        })}`
      )
      .subscribe((response: any) => {
        this.offeredSectionDropdown = response?.data?.data;
        this.getRouteParameters();
      });
  }

  getOfferedClassDropdown(session_id: number){
    this.api
      .get(
        `class/offered-class?page=0&size=1&search=${this.api.getSearchData({
          session_id: session_id,
        })}`
      )
      .subscribe((response: any) => {
        this.offeredClassDropdown = response?.data?.data;
      });
  }

}
