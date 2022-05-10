import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { PostOfficeFormComponent } from './post-office-form/post-office-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
@Component({
  selector: 'app-post-office',
  templateUrl: './post-office.component.html',
  styleUrls: ['./post-office.component.scss'],
})
export class PostOfficeComponent implements OnInit {
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
      post_office_code: [null],
      division_code: [null],
      district_code: [null],
      thana_code: [null],
    });
  }

  divisionDropdown: any[] = [];
  districtDropdown: any[] = [];
  thanaDropdown: any[] = [];
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

  tableStructure: any = {
    headers: [
      'id',
      'en_name',
      'bn_name',
      'post_office_code',
      'division.en_name',
      'district.en_name',
      'thana.en_name',
      'actions',
    ],
    banned: [
      'Sl No',
      'Name (English)',
      'Name (Bangla)',
      'Code',
      'Division',
      'District',
      'Thana',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary'
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn'
    },
  ];
  table_reload: boolean = false;

  ngOnInit(): void {
    this.getDivisionDropdown();
    this.getDistrictDropdown();
    this.getThanaDropdown();
  }

  getDivisionDropdown() {
    this.api.get('settings/division').subscribe((response: any) => {
      this.divisionDropdown = response.data.data;
    });
  }

  getDistrictDropdown() {
    this.api.get('settings/district').subscribe((response: any) => {
      this.districtDropdown = response.data.data;
    });
  }

  getThanaDropdown() {
    this.api.get('settings/thana').subscribe((response: any) => {
      this.thanaDropdown = response.data.data;
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

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(PostOfficeFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          division: this.divisionDropdown,
          status: this.statusDropdown,
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
    this.api.post('settings/post-office', data).subscribe(
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
    const dialogRef = this.dialog.open(PostOfficeFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          division: this.divisionDropdown,
          status: this.statusDropdown,
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
    this.api.update(`settings/post-office/${id}`, data).subscribe(
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
        title: 'Do you want to delete Union Parishad?',
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
    this.api.delete('settings/post-office/', id).subscribe(
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
    }
  }
}
