import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-class-subject-student',
  templateUrl: './class-subject-student.component.html',
  styleUrls: ['./class-subject-student.component.scss']
})
export class ClassSubjectStudentComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchParam = this.formBuild.group({
      category_id: [],
      topic_id: [],
      title: [],
    });
  }

  tableStructure: any = {
    headers: ['id', 'student.name', 'student.email', 'student.mobile_no', 'actions'],
    banned: ['Sl No', 'Name', 'E-Mail', 'Mobile Number', 'Actions'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
    // {
    //   tooltip: 'Delete',
    //   action: 'delete',
    //   icon: 'delete',
    //   color: 'warn',
    // },
  ];
  table_reload: boolean = false;

  subjectDropdown: any[] = [];

  first_reload_off: boolean = true;
  class_unique_code: any;
  get query_params(): any {
    return {
      class_unique_code: this.class_unique_code?.class_unique_code,
    };
  }

  showBackendMessage(response: any) {
    let snackbarRef = this.dialog.open(SnackberMessageComponent, {
      position: {
        top: '0px',
        right: '0px',
      },
      data: response,
    });
  }

  resetSearch() {
    this.searchParam.reset();
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  changeRoute() {
    this.class_unique_code?.class_unique_code
      ? this.router.navigate([
          '/dashboard/class-management/subject-student',
          { id: this.class_unique_code?.class_unique_code },
        ])
      : this.router.navigate([
          '/dashboard/class-management/subject-student',
        ]);
    this.reloadTable();
  }

  getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      this.class_unique_code = this.subjectDropdown.find((sub: any) => {
        return sub?.class_unique_code === params.get('id');
      });
      if(this.class_unique_code){
        this.first_reload_off = false;
        this.reloadTable();
      }
    });
  }

  ngOnInit(): void {
    this.getSubjectDropdown()
  }

  getSubjectDropdown() {
    this.api
      .get('class/class-subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
        this.getRouteParameters();
      });
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      // this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      // this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      // this.actionForDetails(event.data);
    } else if (event.action === 'all_data') {
      // this.tableDataList = event.data;
    }
  }

  reRouteToUrl(event: string) {
    if (event === 'sub_det') {
      this.router.navigate([
        '/dashboard/class-management/class-subject-details',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    }
  }

}
