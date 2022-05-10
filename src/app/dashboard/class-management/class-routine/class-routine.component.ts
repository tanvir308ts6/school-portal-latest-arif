import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-class-routine',
  templateUrl: './class-routine.component.html',
  styleUrls: ['./class-routine.component.scss'],
})
export class ClassRoutineComponent implements OnInit {
  
  subjectDropdown: any[] = [];
  teacherDropdown: any[] = [];
  instituteDropdown: any[] = [];
  sessionDropdown: any[] = [];

  currentTabIndex: number = 0;
  constructor(
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.getSubjectDropdown();
    this.getTeacherDropdown();
    this.getSessionDropdown();
  }

  getInstituteDropdown() {
    this.api
      .get('settings/institute?page=0&size=-1')
      .subscribe((response: any) => {
        this.instituteDropdown = response?.data?.data;
      });
  }

  getSubjectDropdown() {
    this.api
      .get('settings/subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
      });
  }

  getTeacherDropdown() {
    let search: any = {
      type: 'Teacher',
    };
    this.api
      .get(
        `user/employee?page=0&size=-1&search=${this.api.getSearchData(search)}`
      )
      .subscribe((response: any) => {
        this.teacherDropdown = response?.data?.data;
      });
  }

  getSessionDropdown() {
    this.api
      .get('settings/session?page=0&size=-1')
      .subscribe((response: any) => {
        this.sessionDropdown = response?.data?.data;
      });
  }
}
