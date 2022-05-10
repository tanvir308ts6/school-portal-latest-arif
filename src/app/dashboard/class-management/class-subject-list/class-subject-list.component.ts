import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-class-subject-list',
  templateUrl: './class-subject-list.component.html',
  styleUrls: ['./class-subject-list.component.scss'],
})
export class ClassSubjectListComponent implements OnInit {
  classSubjectDropdown: any[] = [];
  searchParam: FormGroup;
  subscriptionList: Array<Subscription> = [];
  
  constructor(
    public api: ApiService, 
    private router: Router,
    private sessData: SessionDataPassService,
    private formBuild: FormBuilder,
  ) {
    this.searchParam = formBuild.group({
      session_id: [],
      class_id: [],
      shift_id: [],
      group_id: []
    });
    this.subscriptionList.push(
      sessData.getSession.subscribe((sess: number) => {
        this.searchParam.controls['session_id'].setValue(sess);
        this.getClassSubjectDropdown();
      })
    );
  }

  ngOnInit(): void {
    this.getClassSubjectDropdown();
  }

  ngOnDestroy(){
    this.subscriptionList.forEach(subs => subs.unsubscribe());
  }

  getClassSubjectDropdown() {
    let searchValue: any = this.searchParam.value;
    this.api
      .get(`class/class-subject?page=0&size=-1&search=${this.api.getSearchData(searchValue)}`)
      .subscribe((response: any) => {
        this.classSubjectDropdown = response?.data?.data;
      });
  }
  cardCLicked(data: any) {
    this.router.navigate([
      '/dashboard/class-management/class-subject-details',
      { id: data },
    ]);
  }
}
