import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-assignment-solution',
  templateUrl: './assignment-solution.component.html',
  styleUrls: ['./assignment-solution.component.scss']
})
export class AssignmentSolutionComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  formItemsData: FormGroup;
  editor = ClassicEditor;
  instituteDropdown: any[];
  file: any;
  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  assignmentDropdown:any[]=[];
  archiveDropdown:any[]=[];
  assignmentSolution:any[]=[];
  finalObj:any;
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
    public dialogRef: MatDialogRef<AssignmentSolutionComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.formItemsData = this.formBuild.group({
      comment: ['', checkRequired('comment')],
      
      upload_solution: [],
      status: ["1" , checkRequired('Status')],
      
    });
    this.instituteDropdown = this.data.dropdowns.institute;
    if(this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
      this.setCode();
    }
  }

  ngOnInit(): void {
    this.archiveDropdown=this.data.dropdowns.archiveDropdown;
    console.log('this.data.data',this.data.data.id);
    this.assignmentGet();
    this.setDataForEdit(true);

   
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
    this.loaderService.submissionControl.subscribe((data)=>{
     
    })
    this.api.get(`class/assignment-solution?assignment_id=${this.data.data.id}`).subscribe((response) => {
      this.assignmentSolution = response.data.data;
      console.log('this.assignmentSolution',this.assignmentSolution.length);
    })
  }
 assignmentGet(){
   this.api.get('class/assignment').subscribe((response) => {
      this.assignmentDropdown = response.data.data;
    });
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
      formData.append('upload_solution', this.file, this.file.name);
    }  
   
    formData.append('assignment_id', this.data.data.id);
    formData.append('comment', data.comment);    
    if(this.assignmentSolution){
      
      formData.append('_method', 'PUT');
      this.finalObj = {
      formData:formData,
      id:this.assignmentSolution[0].id
    }
    }
    else{
      this.finalObj = {
      formData:formData,
      
    }
    }
   
   
    console.log('formData',formData);
    if(this.formItemsData.valid){
      this.onSubmitEvent.emit(this.finalObj);
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
