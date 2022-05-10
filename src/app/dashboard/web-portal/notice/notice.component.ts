import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { NoticeFormComponent } from './notice-form/notice-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ViewDetailsComponent } from './view-details/view-details.component';


@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
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
      en_name: [''],
      division_code: [null],
    });
  }

  tableStructure: any = {
    headers: ['id', 'title', 'published_date',  'status', 'actions'],
    banned: [
      'Sl No',
      'Title',
      'Published date',
      
      'Status',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
    },
    
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
    },
  ];
  table_reload: boolean = false;
  instituteDropdown:any[]=[];
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
    this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
    });
    this.loaderService.setSubmissionStatus(true);
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
    const dialogRef = this.dialog.open(NoticeFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          instituteDropdown:this.instituteDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result, dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('settings/notice', data).subscribe(
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
    const dialogRef = this.dialog.open(NoticeFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          instituteDropdown:this.instituteDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(result, data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`settings/notice/${id}`, data).subscribe(
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
    this.api.delete('settings/notice/', id).subscribe(
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
      this.viewDetailsAction(event.data);
    }
  }
   viewDetailsAction(data:any){
     const dialogRef = this.dialog.open(ViewDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
      },
    });
  }
}