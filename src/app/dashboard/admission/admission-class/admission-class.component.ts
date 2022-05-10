import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { AdmissionClassFormComponent } from './admission-class-form/admission-class-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';

@Component({
  selector: 'app-admission-class',
  templateUrl: './admission-class.component.html',
  styleUrls: ['./admission-class.component.scss'],
})
export class AdmissionClassComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.searchParam = this.formBuild.group({
      title: [''],
      roll_prefix: [''],
      is_admission: [1]
    });
  }

  tableStructure: any = {
    headers: ['id', 'title', 'roll_prefix', 'educational_level.title', 'actions'],
    banned: ['Sl No', 'Class', 'Roll prefix', 'Educational Level', 'Actions'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn'
    },
  ];
  table_reload: boolean = false;

  classDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: '0',
      text: 'Inactive',
    },
    {
      id: '1',
      text: 'Active',
    },
  ];

  ngOnInit(): void {
    this.getClassList();
  }

  getClassList(){
    this.api.get('settings/class?page=0&size=-1').subscribe((response: any) => {
      this.classDropdown = response?.data?.data;
    })
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
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

  actionForAdd() {
    const dialogRef = this.dialog.open(AdmissionClassFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          class: this.classDropdown
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.callAddApi(result.value, dialogRef);
      }
    });
  }

  callAddApi(data: any, dialogRef: any) {
    let tempClassId = data.class_id;
    delete data.class_id;
    this.api.update(`settings/class/${tempClassId}`, data).subscribe(
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
    const dialogRef = this.dialog.open(AdmissionClassFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          class: this.classDropdown
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.callEditApi(result.value, data.id, dialogRef);
      }
    });
  }

  callEditApi(data: any, id: number, dialogRef: any) {
    delete data.class_id;
    this.api.update(`settings/class/${id}`, data).subscribe(
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
        title: 'Do you want to delete Class?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.callDeleteApi(data, data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  callDeleteApi(data: any, id: number, dialogRef: any) {
    data.is_admission = 0;
    this.api.update(`settings/class/${id}`, data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage({
          message: 'Admission class removed succesfully',
          status: 'success',
          code: '200'
        });
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
    }
  }
}
