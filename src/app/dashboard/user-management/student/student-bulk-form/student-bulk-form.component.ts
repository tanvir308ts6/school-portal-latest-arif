import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-student-bulk-form',
  templateUrl: './student-bulk-form.component.html',
  styleUrls: ['./student-bulk-form.component.scss']
})
export class StudentBulkFormComponent implements OnInit {

  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  formItemsData: FormGroup;
  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();

  instituteDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<StudentBulkFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      institute_id: [],
      upload_student: [],
      _method: 'POST'
    })
    this.instituteDropdown = this.data.dropdowns.institute;
    if(this.instituteDropdown && this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
    }
  }

  ngOnInit(): void {
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
  }

  validateForm() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  downloadFile(){
    window.open(`../../../../../${environment.asset_prefix}assets/files/student_bulk_add.xlsx`);
  }

  fileUpload(event: any){
    this.formItemsData.controls['upload_student'].setValue(event?.target?.files[0]);
  }

}
