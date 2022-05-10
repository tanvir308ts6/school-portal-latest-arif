import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-upload-application-form',
  templateUrl: './upload-application-form.component.html',
  styleUrls: ['./upload-application-form.component.scss']
})
export class UploadApplicationFormComponent implements OnInit {
 config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  formItemsData: FormGroup;
  editor = ClassicEditor;
  instituteDropdown: any[];
  file: any;
  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  statusDropdown: any[] = [
  {
    id: '0',
    text: 'Inactive',
  },
  {
    id: '1',
    text: 'Active',
  }
  ]


  constructor(  public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<UploadApplicationFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.formItemsData = this.formBuild.group({
      title: ['', checkRequired('Title')],
      description: ['', checkRequired('description')],
      institute_id: ['', checkRequired('description')],
      status: [],
      
    });
    this.instituteDropdown = this.data.dropdowns.institute;
    console.log('this.instituteDropdown[0].id',this.instituteDropdown[0].id);
    if(this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
      this.setCode();
    }
  }

  ngOnInit(): void {
    console.log("this.data.data.id",this.data);
    // this.setDataForEdit(true);
    // if(this.data.data){
    //   this.formItemsData.patchValue({
    //     title: this.data.data.title,
    //     description: this.data.data.description,
    //     published_date: this.data.data.published_date,
    //     submission_date: this.data.data.submission_date,
    //     form_fee: this.data.data.form_fee,
    //     // institute_id: Number(this.data.data.institute_id),
    //     // status: this.data.data.status,
    //   });
    // }
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
    this.loaderService.submissionControl.subscribe((data)=>{
     
    })
  }
 
  validateForm(){
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  
    let data = this.formItemsData.value;
    console.log("data,data",data);
    let formData = new FormData();

    if (this.file) {
      formData.append('attachment_url', this.file, this.file.name);
    }  
   
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('admission_circular_id', this.data.data.id);
    // formData.append('_method', 'POST');
     if(this.data.data){
      formData.append('_method', 'POST');
    }
     console.log("data,data",formData);

    if(this.formItemsData.valid){
      this.onSubmitEvent.emit(formData);
    }
  }

  setDataForEdit(sourceData?: boolean){
    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        published_date: this.data.data.published_date,
        submission_date: this.data.data.submission_date,
        form_fee: this.data.data.form_fee,
        status: this.data.data.status,
      });

    }
  }
  setDateFormat() {
    let val = this.formItemsData.value['published_date'];
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['published_date'].setValue(val);
    let val2 = this.formItemsData.value['submission_date'];
    val2 = formatDate(val2, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['submission_date'].setValue(val2);
  }
  resetAction(){
    if(this.data.data){
      this.setDataForEdit(true);
    }else{
      this.resetForm();
    }
  }

  resetForm(){
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });
    this.code = '';
  }
    loadFile(event: any) {
 // console.log(event,this.file );
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
       console.log(event,this.file );
    }
  }
  setCode(){
    if(this.formItemsData.value.institute_id){
      this.instituteDropdown.some((data)=>{
        if(data.id == this.formItemsData.value.institute_id){
          this.code = data.eiin_no;
          return true;
        }else{
          return null;
        }
      })
    }
  }

}
