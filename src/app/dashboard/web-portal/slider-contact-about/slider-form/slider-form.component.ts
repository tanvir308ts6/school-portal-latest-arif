import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { checkOnlyDigit, checkOnlyNumber, checkRequired } from 'src/app/directives/validation/validation.directive';
import { ImageModifierComponent } from 'src/app/common-component/image-modifier/image-modifier.component';

@Component({
  selector: 'app-slider-form',
  templateUrl: './slider-form.component.html',
  styleUrls: ['./slider-form.component.scss'],
})
export class SliderFormComponent implements OnInit {
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
  editor = ClassicEditor;

  statusDropdown: any[] = [
    {
      id: 0,
      text: 'Inactive',
    },
    {
      id: 1,
      text: 'Active',
    },
  ]

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<SliderFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      institute_id: [],
      title: ['', checkRequired('Title')],
      description: [],
      upload_slider: [],
      duration: [],
      order: [null, [checkRequired('Order'), checkOnlyNumber('Order')]],
      status: [1],
      _method: ['POST'],
    });
    if(this.data.dropdowns.institute && this.data.dropdowns.institute.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.data.dropdowns.institute[0].id);
    }
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {});
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
    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        order: this.data.data.order,
        status: Number(this.data.data.status),
        duration: this.data?.data?.duration,
        _method: 'PUT',
      })
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

  setFileData(event: any, form: FormGroup, control: string) {
    if (event?.target?.files && event?.target?.files.length) {
      form.controls[control].setValue(event?.target?.files[0]);
    }
  }

  openImageCropper(form: FormGroup, control: string){
    const dialogRef = this.dialog.open(ImageModifierComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: {ratio: 1920/550}
    });
    dialogRef.componentInstance.onImageCrop.subscribe((result: any) => {
      form.controls[control].setValue(result);
    })
  }
}
