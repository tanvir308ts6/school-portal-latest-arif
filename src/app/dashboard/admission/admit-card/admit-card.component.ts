import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { AdmitCardFormComponent } from './admit-card-form/admit-card-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admit-card',
  templateUrl: './admit-card.component.html',
  styleUrls: ['./admit-card.component.scss'],
})
export class AdmitCardComponent implements OnInit {
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
  tableStructure: any = {
    headers: [
      'id',
      'center',
      'date',
      'duration',
      'time',
      'class_title',
      'status',
      'actions',
    ],
    banned: [
      'Sl No',
      'Center',
      'Date',
      'Duration',
      'Start Time',
      'Admission class',
      'Status',
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
    // this.getDataFromApi();
    // this.loaderService.setSubmissionStatus(true);
  }

  // changePagination(event: any) {
  //   let pageData = {
  //     pageIndex: event.pageIndex + 1,
  //     pageSize: event.pageSize,
  //   };
  //   this.storage.setFilterData(pageData);
  //   this.getDataFromApi();
  // }

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

  // getDataFromApi() {
  //   this.loaderStatus = true;
  //   this.searchString = this.api.getSearchData(this.searchParam.value);
  //   this.storage.setFilterData({
  //     search: this.searchString ? this.searchString : 'clear',
  //   });
  //   let searchData = this.api.getFilterData({ pagination: true, search: true });
  //   this.paginateStartNo = searchData['paginateStartNo'];
  //   this.api
  //     .get('admission/admit-card-Configuration' + searchData['searchData'])
  //     .subscribe((response) => {
  //       this.dataSource = new MatTableDataSource(response.data.data);
  //       this.total = response.data.total;
  //       this.loaderStatus = false;
  //     });
  // }

  actionForAdd() {
    const dialogRef = this.dialog.open(AdmitCardFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          status: this.statusDropdown,
          institute: this.instituteDropdown,
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
    this.api.post('admission/admit-card-Configuration', data).subscribe(
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
    const dialogRef = this.dialog.open(AdmitCardFormComponent, {
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
        this.editInventoryCategory(result, data.id, dialogRef);
      }
    });
  }

  editInventoryCategory(data: any, id: number, dialogRef: any) {
    this.api.post(`admission/admit-card-Configuration/${id}`, data).subscribe(
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
    this.api.delete('admission/admit-card-Configuration/', id).subscribe(
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
      // this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      // this.actionForDetails(event.data);
    }
  }
}
