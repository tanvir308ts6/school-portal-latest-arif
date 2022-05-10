import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
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
  instituteDropdown:any[]=[];
  file: any;
  file2: any;
  statusDropdown: any[] = [];
  editor = ClassicEditor;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<EventFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      title: ['', checkRequired('Title')],
      description: ['', checkRequired('description')],
      published_date: [null, checkRequired('Published date')],
      institute_id: [],
      upload_attachment: [],
      order: ['', checkRequired('order')],
      status: [1, checkRequired('Status')],
      upload_cover: [],
      custom: []
    });
    this.statusDropdown = data.dropdowns.status;
  }

  ngOnInit(): void {
    this.instituteDropdown = this.data.dropdowns.instituteDropdown;

    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {
      
    });
  }
   loadFile(event: any) {
    // console.log(event,this.file );
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
      console.log(event,this.file );
    }
  }
  loadFile2(event: any) {
    // console.log(event,this.file );
    if (event.target.files && event.target.files.length) {
      this.file2 = event.target.files[0];
      console.log(event,this.file2 );
    }
  }
   validateForm(){
    
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  
    if(this.formItemsData.value.published_date){
      let val = this.formItemsData.value['published_date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['published_date'].setValue(val);
    }
    let data = this.formItemsData.value;
    console.log("data,data",data);
    let formData = new FormData();

    if (this.file) {
      formData.append('upload_attachment', this.file, this.file.name);
    }  
    if (this.file2) {
      formData.append('upload_cover', this.file2, this.file2.name);
    } 
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('published_date', data.published_date);
    formData.append('institute_id', data.institute_id);
    formData.append('order', data.order);    
    formData.append('status', data.status);
    // formData.append('_method', 'POST');
     if(this.data.data){
      formData.append('_method', 'PUT');
    }
     console.log("data,data",formData);

    if(this.formItemsData.valid){
      this.onSubmitEvent.emit(formData);
    }
  }
  validateForm2() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      // this.onSubmitEvent.emit(this.formItemsData);
      console.log(this.formItemsData);
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        order: this.data.data.order,
        published_date: this.data.data.published_date,
        institute_id: Number(this.data.data.institute_id),
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
