import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-class-subject-details',
  templateUrl: './class-subject-details.component.html',
  styleUrls: ['./class-subject-details.component.scss'],
})
export class ClassSubjectDetailsComponent implements OnInit {
  class_unique_code: any;
  searchParam: any;
  current_graph_tab_index: number = 0;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  subjectDropdown: any[] = [];

  ngOnInit(): void {
    this.getSubjectDropdown();
  }

  getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      this.class_unique_code = this.subjectDropdown.find((sub: any) => {
        return sub?.class_unique_code === params.get('id');
      });
    });
  }

  changeRoute() {
    this.class_unique_code?.class_unique_code
      ? this.router.navigate([
          '/dashboard/class-management/class-subject-details',
          { id: this.class_unique_code?.class_unique_code },
        ])
      : this.router.navigate([
          '/dashboard/class-management/class-subject-details',
        ]);
  }

  getSubjectDropdown() {
    this.api
      .get('class/class-subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
        this.getRouteParameters();
      });
  }

  tabChangeEvent({ index }: { index: number }) {
    this.current_graph_tab_index = index;
  }

  reRouteToUrl(event: string) {
    if (event === 'sub_mat') {
      this.router.navigate([
        '/dashboard/class-management/subject-material',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    } else if (event === 'ass_ign') {
      this.router.navigate([
        '/dashboard/class-management/assignment',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    } else if (event === 'exa_qui') {
      // this.router.navigate([
      //   '/dashboard/class-management/assignment',
      //   { id: this.class_unique_code?.class_unique_code },
      // ]);
    } else if (event === 'sub_tea') {
      this.router.navigate([
        '/dashboard/class-management/subject-teacher',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    } else if (event === 'sub_stu') {
      this.router.navigate([
        '/dashboard/class-management/subject-student',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    } else if (event === 'onl_lin') {
      // this.router.navigate([
      //   '/dashboard/class-management/assignment',
      //   { id: this.class_unique_code?.class_unique_code },
      // ]);
    }
  }
}
