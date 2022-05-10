import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';

import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admit-student',
  templateUrl: './admit-student.component.html',
  styleUrls: ['./admit-student.component.scss']
})
export class AdmitStudentComponent implements OnInit {

   config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
 
  code: string = '';
  loaderStatus: boolean = false;
  formItemsData: FormGroup;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  sectionDropdown: any[] = [
   
  ]

  constructor(public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AdmitStudentComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
     this.formItemsData = this.formBuild.group({
      studentNo: [],
      sectionId: [],
      
      
    });
  
     }
  ngOnInit(): void {    
    console.log("this.data.data",this.data.data);
     this.api.get('institute/institute-section').subscribe((response) => {
      console.log(response.section.data);
      this.sectionDropdown = response.section.data;
    })
 
  }
  AdmitStudent(data:any){
       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: '150px',
            width: '300px',
            disableClose: true,
            data: {
              leftBtn: 'Cancel',
              rightBtn: 'Yes',
              leftBtnIcon: 'cancel',
              rightBtnIcon: 'check_circle',
              title: 'Do you want to admit?'
            }
          });
          dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
            if (result.status == 1) {
              this.loaderService.setLoaderStatus(true);
              let studentNo = this.formItemsData.value.studentNo;
              let sectionId = this.formItemsData.value.sectionId;
              let approveData = {
                applicants_status:'Admitted',
                studentNo:studentNo,
                sectionId:sectionId

              }
              this.api.update(`admission/applicant-admission/${data}`, approveData).subscribe(
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
                  dialogRef.close();
                 
                }
                );
             
            } else {
              dialogRef.close();
            }
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

}
