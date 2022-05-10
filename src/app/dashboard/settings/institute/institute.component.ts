import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { InstituteFormComponent } from './institute-form/institute-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { InstituteDetailsComponent } from './institute-details/institute-details.component';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss'],
})
export class InstituteComponent implements OnInit {
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
      organization_type_id: [null],
      name_en: [null],
      short_name: [null],
      division_code: [null],
      district_code: [null],
      thana_code: [null],
      post_code: [null],
      eiin_no: [null],
      institute_type: [null],
    });
  }

  tableStructure: any = {
    headers: [
      'id',
      'name_en',
      'district.en_name',
      'thana.en_name',
      'organization_type.title',
      'institute_type',
      'actions',
    ],
    banned: [
      'Sl No',
      'Name',
      'District',
      'Upazila',
      'Organization Type',
      'Educational Level',
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
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
  ];
  table_reload: boolean = false;

  instituteTypeDropdown: any[] = [
    {
      text: 'Government',
    },
    {
      text: 'Non Government',
    },
  ];
  postOfficeDropdown: any[] = [];
  thanaDropdown: any[] = [];
  districtDropdown: any[] = [];
  divisionDropdown: any[] = [];
  organizationTypeDropdown: any[] = [];
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
    this.getDivisionDropdown();
    this.getDistrictDropdown();
    this.getThanaDropdown();
    this.getPostOfficeDropdown();
    this.getOrganizationTypeDropdown();
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

  getPostOfficeDropdown() {
    this.api.get('settings/post-office').subscribe((response: any) => {
      this.postOfficeDropdown = response.data.data;
    });
  }

  getOrganizationTypeDropdown() {
    this.api.get('settings/organization-type').subscribe((response: any) => {
      this.organizationTypeDropdown = response.data.data;
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
    const dialogRef = this.dialog.open(InstituteFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          division: this.divisionDropdown,
          organizationType: this.organizationTypeDropdown,
          instituteType: this.instituteTypeDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('settings/institute', data).subscribe(
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
    const dialogRef = this.dialog.open(InstituteFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          division: this.divisionDropdown,
          organizationType: this.organizationTypeDropdown,
          instituteType: this.instituteTypeDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(this.api.getAsFormData(result.value), data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`settings/institute/${id}`, data).subscribe(
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
        title: 'Do you want to delete institute?',
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
    this.api.delete('settings/institute/', id).subscribe(
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

  actionForDetails(data: any) {
    const dialogRef = this.dialog.open(InstituteDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        headerData: {
          logo_id: data?.logo_id,
          en_name: data?.name_en,
        },
        tableData: [
          {
            key: 'English Name',
            value: data?.name_en,
          },
          {
            key: 'Bangla Name',
            value: data?.name_bn,
          },
          {
            key: 'Short Name',
            value: data?.short_name,
          },
          {
            key: 'Organization Type',
            value: data?.organization_type?.title,
          },
          {
            key: 'Institute Type',
            value: data?.institute_type,
          },
          {
            key: 'EIIN No.',
            value: data?.eiin_no,
          },
          {
            key: 'Website Url',
            value: data?.website_url,
          },
          {
            key: 'Division',
            value: data?.division?.en_name,
          },
          {
            key: 'District',
            value: data?.district?.en_name,
          },
          {
            key: 'Upazila',
            value: data?.thana?.en_name,
          },
          {
            key: 'Post Office',
            value: data?.post_office?.en_name,
          },
          {
            key: 'Address',
            value: data?.address,
          },
        ],
      },
    });
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    }
  }
}
