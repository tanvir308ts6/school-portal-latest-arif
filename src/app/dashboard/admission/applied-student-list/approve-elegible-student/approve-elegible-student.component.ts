import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';

import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-approve-elegible-student',
  templateUrl: './approve-elegible-student.component.html',
  styleUrls: ['./approve-elegible-student.component.scss'],
})
export class ApproveElegibleStudentComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;

  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  // statusDropdown: any[] = [
  //   {
  //     id: '0',
  //     text: 'Inactive',
  //   },
  //   {
  //     id: '1',
  //     text: 'Active',
  //   }
  // ]

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ApproveElegibleStudentComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log('this.data.data', this.data.data);
  }
  ApproveElgibleStudent(data: any, reject?: boolean) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to make eligible for admission test?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        let approveData = {
          applicants_status: 'Eligible for admission test',
        };
        this.api
          .update(
            `admission/applicant-application/eligible/${data}`,
            approveData
          )
          .subscribe(
            (response) => {
              this.showBackendMessage(response.response);
              this.loaderService.setLoaderStatus(false);
              dialogRef.close();
              this.dialogRef.close();
              this.onSubmitEvent.emit();
            },
            (error) => {
              this.showBackendMessage(error.error.response);
              this.loaderService.setLoaderStatus(false);
              this.loaderService.setSubmissionStatus(false);
            }
          );
      } else {
        dialogRef.close();
      }
    });
  }
  ApproveElgibleStudentAdmission(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to make eligible for admission?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        let approveData = {
          applicants_status: 'Eligible for admission',
        };
        this.api
          .update(
            `admission/applicant-application/eligible/${data}`,
            approveData
          )
          .subscribe(
            (response) => {
              this.showBackendMessage(response.response);
              this.loaderService.setLoaderStatus(false);
              dialogRef.close();
              this.dialogRef.close();
              this.onSubmitEvent.emit();
            },
            (error) => {
              this.showBackendMessage(error.error.response);
              this.loaderService.setLoaderStatus(false);
              this.loaderService.setSubmissionStatus(false);
            }
          );
      } else {
        dialogRef.close();
      }
    });
  }
  rejectStudent(data: any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to reject student?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        let approveData = {
          applicants_status: 'Not Approved',
        };
        this.api
          .update(
            `admission/applicant-application/eligible/${data}`,
            approveData
          )
          .subscribe(
            (response) => {
              this.showBackendMessage(response.response);
              this.loaderService.setLoaderStatus(false);
              dialogRef.close();
              this.dialogRef.close();
              this.onSubmitEvent.emit();
            },
            (error) => {
              this.showBackendMessage(error.error.response);
              this.loaderService.setLoaderStatus(false);
              this.loaderService.setSubmissionStatus(false);
            }
          );
      } else {
        dialogRef.close();
      }
    });
  }
  // ApproveElgibleStudent(data:any){
  //   console.log(data);

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
}
