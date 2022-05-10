import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.scss']
})
export class AssignmentFormComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  formItemsData: FormGroup;
  editor = ClassicEditor;
  instituteDropdown: any[];
  file: any;
  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  classSubjectDropdown:any[]=[];
  archiveDropdown:any[]=[];
  statusDropdown: any[] = [
  {
    id: 0,
    text: 'Inactive',
  },
  {
    id: 1,
    text: 'Active',
  }
  ]

  uploadTypeDropdown: any[] = [
  {
  
    text: 'Archive',
  },
  {
   
    text: 'Upload',
  }
  ]
  constructor(  public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AssignmentFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.formItemsData = this.formBuild.group({
      // institute_id: ['', checkRequired('Institute')],
      title: ['', checkRequired('Title')],
      type: ['Specific'],
      description: [''],
      class_unique_code: ['', checkRequired('Class Subject')],
      deadline: ['', checkRequired('deadline')],
      marks: ['', checkRequired('marks')],
      uploading_type: ['', checkRequired('uploading_type')],
      archive_id: [],
      upload_assignment: [],
      status: ["1" , checkRequired('Status')],
      
    });
    this.instituteDropdown = this.data.dropdowns.institute;
    if(this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
      this.setCode();
    }
  }

  ngOnInit(): void {
    this.classSubjectDropdown=this.data.dropdowns.classSubjectDropdown;
    this.archiveDropdown=this.data.dropdowns.archiveDropdown;
    this.setDataForEdit(true);

    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        class_unique_code:this.data.data.class_unique_code,
        deadline: this.data.data.deadline.substring(0, 10),
        archive_id: Number(this.data.data.content_archive_id),
      
        marks: this.data.data.marks,

        status: this.data.data.status,
      });
    }
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
    let val = this.formItemsData.value['deadline'];
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['deadline'].setValue(val);
    // let val2 = this.formItemsData.value['submission_date'];
    // val2 = formatDate(val2, 'yyyy-MM-dd', 'en');
    // this.formItemsData.controls['submission_date'].setValue(val2);
    let data = this.formItemsData.value;
    console.log("data,data",data);
    let formData = new FormData();

    if (this.file) {
      formData.append('upload_assignment', this.file, this.file.name);
    }  
   
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('deadline', data.deadline);
    formData.append('type', data.type);
    formData.append('class_unique_code', data.class_unique_code);
    formData.append('marks', data.marks);
    formData.append('uploading_type', data.uploading_type);
    if(data.archive_id){
       formData.append('archive_id', data.archive_id);
    }
   
     // formData.append('upload_assignment', data.upload_assignment);
    
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

  setDataForEdit(sourceData?: boolean){
    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        deadline: this.data.data.deadline,
        // submission_date: this.data.data.submission_date,
        form_fee: this.data.data.form_fee,
        status: this.data.data.status,
      });

    }
  }
  setDateFormat() {
    let val = this.formItemsData.value['deadline'];
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['deadline'].setValue(val);
   
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
