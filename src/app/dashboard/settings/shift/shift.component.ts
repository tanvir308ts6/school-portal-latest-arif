import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ShiftFormComponent } from './shift-form/shift-form.component';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

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
      branch: [''],
      address: [''],
    });
  }

  tableStructure: any = {
    headers: ['id', 'title', 'status', 'actions'],
    banned: ['Sl No', 'Title', 'Status', 'Actions'],
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
    this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
    });
    this.loaderService.setSubmissionStatus(true);
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
  //     .get('settings/shift' + searchData['searchData'])
  //     .subscribe((response) => {
  //       this.dataSource = new MatTableDataSource(response.data.data);
  //       this.total = response.data.total;
  //       this.loaderStatus = false;
  //     });
  // }

  actionForAdd() {
    const dialogRef = this.dialog.open(ShiftFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          institute: this.instituteDropdown,
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
    this.api.post('settings/shift', data).subscribe(
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
    const dialogRef = this.dialog.open(ShiftFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
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
    this.api.update(`settings/shift/${id}`, data).subscribe(
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
    this.api.delete('settings/shift/', id).subscribe(
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
    }
  }

}
