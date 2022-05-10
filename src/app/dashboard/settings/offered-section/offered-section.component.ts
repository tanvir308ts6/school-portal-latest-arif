import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { OfferedSectionFormComponent } from './offered-section-form/offered-section-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';

@Component({
  selector: 'app-offered-section',
  templateUrl: './offered-section.component.html',
  styleUrls: ['./offered-section.component.scss'],
})
export class OfferedSectionComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  sectionDropdown: any[] = [];
  groupDropdown: any[] = [];
  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private sassId: SessionDataPassService
  ) {
    this.searchParam = this.formBuild.group({
      title: [],
      code: [],
      institute_id: [],
      class_id: [],
      section_id: [],
      session_id: [],
      group_id: [],
      status: [],
    });
    this.sassId.getSession.subscribe((sess: number) => {
      this.searchParam.controls['session_id'].setValue(sess);
      this.reloadTable();
    });
  }

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
  instituteDropdown: any[] = [];
  sessionDropdown: any[] = [];
  subjectDropdown: any[] = [];
  classDropdown: any[] = [];
  shiftDropdown: any[] = [];

  tableStructure: any = {
    headers: [
      'id',
      'institute.name_en',
      'academic_class.title',
      'section.title',
      'group.title',
      'status',
      'actions',
    ],
    banned: [
      'Sl No',
      'Institute',
      'Class',
      'Section',
      'Group',
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
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
  ];
  table_reload: boolean = false;

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.loaderService.setSubmissionStatus(true);
    this.api.get('settings/class').subscribe((response) => {
      this.classDropdown = response.data.data;
    });
    this.api.get('settings/section').subscribe((response) => {
      this.sectionDropdown = response.data.data;
    });
    this.api.get('settings/group').subscribe((response) => {
      this.groupDropdown = response.data.data;
    });
    this.api.get('settings/session').subscribe((response) => {
      this.sessionDropdown = response.data.data;
    });
    this.api.get('settings/subject').subscribe((response) => {
      this.subjectDropdown = response.data.data;
    });
    this.api.get('settings/shift').subscribe((response) => {
      this.shiftDropdown = response.data.data;
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

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(OfferedSectionFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          subject: this.subjectDropdown,
          class: this.classDropdown,
          section: this.sectionDropdown,
          group: this.groupDropdown,
          shift: this.shiftDropdown,
          session: this.sessionDropdown,
          institute: this.instituteDropdown,
        },
        preData: {
          session_id: this.searchParam.value.session_id,
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
    this.api.post('class/offered-section', data).subscribe(
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
    const dialogRef = this.dialog.open(OfferedSectionFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          subject: this.subjectDropdown,
          class: this.classDropdown,
          section: this.sectionDropdown,
          group: this.groupDropdown,
          shift: this.shiftDropdown,
          session: this.sessionDropdown,
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
    this.api.update(`class/offered-section/${id}`, data).subscribe(
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
    this.api.delete('class/offered-section/', id).subscribe(
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
