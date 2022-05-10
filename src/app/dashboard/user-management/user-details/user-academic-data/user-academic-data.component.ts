import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { UserAcademicDetailsComponent } from './user-academic-details/user-academic-details.component';
import { UserAcademicFormComponent } from './user-academic-form/user-academic-form.component';

@Component({
  selector: 'app-user-academic-data',
  templateUrl: './user-academic-data.component.html',
  styleUrls: ['./user-academic-data.component.scss']
})
export class UserAcademicDataComponent implements OnInit {
  @Input() root_url: string = '';
  @Input() user_id: string = '';

  panelOpenState: boolean = false;
  searchParam: FormGroup;
  first_reload_off: boolean = true;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) { 
    this.searchParam = this.formBuild.group({
      exam_name: [],
      institute_name: [],
      passing_year: [],
      user_id: [],
    });
  }

  tableStructure: any = {
    headers: [
      'id',
      (element: any) => `${element?.exam_name}(${element?.education_level})`,
      'institute_name',
      (element: any) => `${element?.result} out of ${element?.scale}`,
      (element: any) => `${element?.passing_year}(${element?.duration} years)`,
      'actions',
    ],
    banned: [
      'Sl No',
      'Examination',
      'Institute',
      'Result',
      'Passing Year',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
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
      tooltip: 'View Certificate Url',
      action: 'view',
      icon: 'language',
      color: 'primary',
    },
  ];
  table_reload: boolean = false;

  statusDropdown: any[] = [
    {
      id: 0,
      text: 'Inactive'
    },
    {
      id: 1,
      text: 'Active'
    }
  ]

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes?.root_url){
      this.reloadTable();
    }if(changes?.user_id){
      this.searchParam.controls['user_id'].setValue(Number(this.user_id));
      this.first_reload_off = false;
      this.reloadTable();
    }
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

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    } else if (event.action === ''){
      this.actionForWebView(event.data);
    }
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(UserAcademicFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        user_id: this.user_id,
        dropdowns: {
          status: this.statusDropdown
        }
      }
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('user/academic-information', data).subscribe(
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

  actionForEdit(data: any){
    const dialogRef = this.dialog.open(UserAcademicFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        user_id: this.user_id,
        data: data,
        dropdowns: {
          status: this.statusDropdown
        }
      }
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(this.api.getAsFormData(result.value), data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`user/academic-information/${id}`, data).subscribe(
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
        title: 'Do you want to delete Academic Information?',
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
    this.api.delete('user/academic-information/', id).subscribe(
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

  actionForDetails(data: any){
    const dialogRef = this.dialog.open(UserAcademicDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        tableData: {
          'Examination': data?.education_level ? `${data?.exam_name}(${data?.education_level})` : data?.exam_name,
          'Institute': data?.institute_name,
          'Result': `${data?.result} out of ${data?.scale}`,
          'Passing Year': data?.passing_year,
          'Duration': data?.duration,
          'Achievement': data?.achievement,
          'Certificate Url': data?.certificate_url,
        },
        file_url: data?.certificate_id
      }
    })
  }

  actionForWebView(data: any){
    window.open(data?.certificate_url);
  }

}
