import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { checkBannedString, checkNoSpecialChar, checkRequired } from 'src/app/directive/validation/custom-val.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-organization-type-form',
  templateUrl: './organization-type-form.component.html',
  styleUrls: ['./organization-type-form.component.scss'],
})
export class OrganizationTypeFormComponent implements OnInit {
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
  // editor = ClassicEditor;
  onSubmitEvent = new EventEmitter();
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



  constructor(  public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<OrganizationTypeFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      title: [],

      status: [],
    });
  }

  ngOnInit(): void {
    this.setDataForEdit(true);

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

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        title: this.data.data.title,
        status: this.data.data.status,
      });
    }
  }

  resetAction() {
    if (this.data.data) {
      this.setDataForEdit(true);
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });
  }
}
