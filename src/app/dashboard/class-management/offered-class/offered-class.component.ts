import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { OfferedClassFormComponent } from './offered-class-form/offered-class-form.component';

@Component({
  selector: 'app-offered-class',
  templateUrl: './offered-class.component.html',
  styleUrls: ['./offered-class.component.scss']
})
export class OfferedClassComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  first_reload_off: boolean = true;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private sassData: SessionDataPassService,
    private router: Router,
  ) {
    this.searchParam = this.formBuild.group({
      class_id: [],
      class_coordinator_id: [],
      session_id: []
    });
    this.sassData.getSession.subscribe((sass: number) => {
      if(sass){
        this.searchParam.controls['session_id'].setValue(sass);
        this.reloadTable();
        this.first_reload_off = false;
      }
    })
  }

  tableStructure: any = {
    headers: [
      'id',
      'session.title',
      'class.title',
      'coordinator.name',
      'actions',
    ],
    banned: [
      'Sl No',
      'Session',
      'Class',
      'Class Co-ordinator',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
      condition: () => !this.searchParam.value.session_id
    },
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
    {
      tooltip: 'Examination Routine',
      action: 'exam-rout',
      icon: 'calendar_today',
      color: 'primary',
      condition: () => !this.searchParam.value.session_id
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
  ];
  table_reload: boolean = false;

  classDropdown: any[] = [];
  teacherDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: 0,
      text: 'Inactive',
    },
    {
      id: 1,
      text: 'Active',
    },
  ];

  ngOnInit(): void {
    this.getClassDropdown();
    this.getTeacherDropdown();
  }

  getClassDropdown(){
    this.api.get(`settings/class`).subscribe((response: any) => {
      this.classDropdown = response?.data?.data;
    })
  }

  getTeacherDropdown(){
    let tempSearch: any = {
      type: 'Teacher'
    }
    this.api.get(`user/employee?page=0&size=-1&search=${this.api.getSearchData(tempSearch)}`).subscribe((response: any) => {
      this.teacherDropdown = response?.data?.data;
    })
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

  actionForAdd() {
    const dialogRef = this.dialog.open(OfferedClassFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          status: this.statusDropdown,
          class: this.classDropdown,
          teacher: this.teacherDropdown
        },
        preData: {
          session_id: this.searchParam.value.session_id
        }
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
    this.api.post('class/offered-class', data).subscribe(
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
    const dialogRef = this.dialog.open(OfferedClassFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          status: this.statusDropdown,
          class: this.classDropdown,
          teacher: this.teacherDropdown
        },
        preData: {
          session_id: this.searchParam.value.session_id
        }
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
    this.api.update(`class/offered-class/${id}`, data).subscribe(
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
        title: 'Do you want to remove class?',
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
    this.api.delete('class/offered-class/', id).subscribe(
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
    } else if (event.action === 'exam-rout') {
      
    } else if (event.action === 'details') {
      this.reRouteToUrl('/dashboard/class-management/class-details', event.data);
    }
  }

  reRouteToUrl(route: string, params: any){
    this.router.navigate([route, {id: params?.id}]);
  }

}
