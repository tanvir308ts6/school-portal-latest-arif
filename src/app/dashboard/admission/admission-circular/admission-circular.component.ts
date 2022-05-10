import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { AdmissionCircularFormComponent } from './admission-circular-form/admission-circular-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';

import { ApproveDialogComponent } from './approve-dialog/approve-dialog.component';
import { UploadApplicationFormComponent } from './upload-application-form/upload-application-form.component';

@Component({
  selector: 'app-admission-circular',
  templateUrl: './admission-circular.component.html',
  styleUrls: ['./admission-circular.component.scss'],
})
export class AdmissionCircularComponent implements OnInit {
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
      code: [''],
      // institute_id: [null],
      status: [null],
    });
  }
  sessionDropdown:any[]=[];
  tableStructure: any = {
    headers: [
      'id',
      'title',
      'published_date',
      'submission_date',
      'form_fee',
      'approval_status',
      'actions',
    ],
    banned: [
      'Sl No',
      'Title',
      'Published date',
      'Submission date',
      'Form fee',
      'Approval status',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
    },
    {
      tooltip: 'Approval',
      action: 'approve',
      icon: 'check_circle',
      color: 'accent',
    },
    {
      tooltip: 'Upload Circular',
      action: 'up_cir',
      icon: 'chrome_reader_mode',
      color: 'accent',
    },
  ];
  table_reload: boolean = false;

  instituteDropdown: any[] = [];

  categoryDropdown: any[] = [];
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
    this.getInstituteDropdown();
    this.api.get('settings/session').subscribe((response) => {
      this.sessionDropdown = response.data.data;
    });
    
  }
  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
    });
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
    const dialogRef = this.dialog.open(AdmissionCircularFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          sessionDropdown:this.sessionDropdown

        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      console.log('result', result);
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addInventoryCatagory(result, dialogRef);
      }
    });
  }

  addInventoryCatagory(data: any, dialogRef: any) {
    console.log('data', data);
    this.api.post('admission/admission-circular', data).subscribe(
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
    const dialogRef = this.dialog.open(AdmissionCircularFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          sessionDropdown:this.sessionDropdown
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editInventoryCategory(result, data.id, dialogRef);
      }
    });
  }

  editInventoryCategory(data: any, id: number, dialogRef: any) {
    this.api.post(`admission/admission-circular/${id}`, data).subscribe(
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
  actionForApprove(data: any) {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: false,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Approve',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Select action you want to perform',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      this.loaderService.setLoaderStatus(true);
      this.changeApprovalStatus(data.id, dialogRef, result.status);
    });
  }
  changeApprovalStatus(id: number, dialog: any, status: string) {
    if (status == 'Approved') {
      this.api
        .update(`admission/admission-circular/approve/${id}`, {
          approval_status: 'Approved',
        })
        .subscribe(
          (response) => {
            this.reloadTable();
            this.showBackendMessage(response.response);
            this.loaderService.setLoaderStatus(false);
            dialog.close();
          },
          (error) => {
            this.showBackendMessage(error.error.response);
            this.loaderService.setLoaderStatus(false);
          }
        );
    } else {
      dialog.close();
    }
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
        title: 'Do you want to delete location?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteInventoryCategory(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }
  deleteInventoryCategory(id: number, dialogRef: any) {
    this.api.delete('admission/admission-circular/', id).subscribe(
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

  actionForUploadApplicationForm(data: any) {
    const dialogRef = this.dialog.open(UploadApplicationFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.uploadApplicationForm(result, dialogRef);
      }
    });
  }
  uploadApplicationForm(data: any, dialogRef: any) {
    this.api.post(`admission/admission-content`, data).subscribe(
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
  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }
  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'approve') {
      this.actionForApprove(event.data);
    } else if (event.action === 'up_cir') {
      this.actionForUploadApplicationForm(event.data);
    }
  }
}
