import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ClassSubjectTeacherFormComponent } from './class-subject-teacher-form/class-subject-teacher-form.component';

@Component({
  selector: 'app-class-subject-teacher',
  templateUrl: './class-subject-teacher.component.html',
  styleUrls: ['./class-subject-teacher.component.scss']
})
export class ClassSubjectTeacherComponent implements OnInit {
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
    headers: ['id', 'teacher.name', 'teacher.email', 'teacher.office_room', 'teacher.mobile_no', 'actions'],
    banned: ['Sl No', 'Name', 'E-Mail', 'Office Room', 'Mobile Number', 'Actions'],
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
  statusDropdown: any[] = [
    {
      id: 1,
      title: 'Active',
    },
    {
      id: 0,
      title: 'Inactive',
    },
  ];
  tableDataList: any[] = [];

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
          '/dashboard/class-management/subject-teacher',
          { id: this.class_unique_code?.class_unique_code },
        ])
      : this.router.navigate([
          '/dashboard/class-management/subject-teacher',
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
    this.getSubjectDropdown();
  }

  getSubjectDropdown() {
    this.api
      .get('class/class-subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
        this.getRouteParameters();
      });
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(ClassSubjectTeacherFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        selects: this.tableDataList,
        permanent: this.class_unique_code,
        dropdowns: {
          status: this.statusDropdown,
          classSubject: this.subjectDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result.value, dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('class/subject-teacher', data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(ClassSubjectTeacherFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        permanent: this.class_unique_code,
        dropdowns: {
          status: this.statusDropdown,
          classSubject: this.subjectDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(result.value, data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.update(`class/subject-teacher/${id}`, data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to deny teacher?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteData(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  deleteData(id: number, dialogRef: any) {
    this.api.delete('class/subject-teacher/', id).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      }
    );
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      // this.actionForDetails(event.data);
    } else if (event.action === 'all_data') {
      this.tableDataList = event.data;
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
