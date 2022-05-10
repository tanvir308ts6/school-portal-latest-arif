import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-admit-card-form',
  templateUrl: './admit-card-form.component.html',
  styleUrls: ['./admit-card-form.component.scss']
})
export class AdmitCardFormComponent implements OnInit {
  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  formItemsData: FormGroup;
  file: any;
  instituteDropdown: any[];
  code: string = '';
  editor = ClassicEditor;
  classDropdown:any[]=[];
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
   examTypeDropdown: any[] = [
    {
      
      text: 'MCQ',
    },
    {
      
      text: 'Written',
    },
    {
      
      text: 'Viva',
    }
  ];
  
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


  constructor(  public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AdmitCardFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
     this.formItemsData = this.formBuild.group({
      exam_type: [],
      subject: [],
      center: ['', [checkRequired('Center is required')]],
      date:['', [checkRequired('Date is required')]],
      duration:[],
      time:[],      
      instructions:[],
      class_id:[1],
      coordinator_name:['', [checkRequired('Coordinator name is required')]],
      coordinator_designation:['', [checkRequired('Coordinator designation is required')]],
      status: ["1" , checkRequired('Status')],
      upload_attachment:[],
      institute_id:[],
      
    });
    this.instituteDropdown = this.data.dropdowns.institute;
    if(this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
     
    }
  }

  ngOnInit(): void {
      this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
    });
     this.api.get(`admission/admission-class?&page=1&size=-1`).subscribe((response) => {
            this.classDropdown = response.data.data;
          });
      
    this.setDataForEdit(true);
    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data.data.title,
        category_id: Number(this.data.data.category_id),
        institute_id: Number(this.data.data.institute_id),
        status: this.data.data.status,
      });
    }
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
    this.loaderService.submissionControl.subscribe((data)=>{
      if(!data){
        let tempCode = this.formItemsData.value.code.split("-")[this.formItemsData.value.code.split("-").length-1];
        this.code = this.formItemsData.value.code.split("-"+tempCode)[0];
        this.formItemsData.controls['code'].setValue(tempCode);
      }
    })
  }
   loadFile(event: any) {
    // console.log(event,this.file );
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
      console.log(event,this.file );
    }
  }
  validateForm2(){
  

    // var duration_start = this.formItemsData.value.duration_start;
    // var duration_end = this.formItemsData.value.duration_end;
    // var duration     = duration_start.concat(" to ",duration_end)

    // this.formItemsData.controls['duration'].setValue(duration);
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if(this.formItemsData.valid){
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }
    validateForm(){
    
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
      if(this.formItemsData.value.date){
      let val = this.formItemsData.value['date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['date'].setValue(val);
    }
   
    let data = this.formItemsData.value;
    console.log("data,data",data);
    let formData = new FormData();

    if (this.file) {
      formData.append('upload_attachment', this.file, this.file.name);
    }  
   
    formData.append('center', data.center);
    formData.append('date', data.date);
    formData.append('time', data.time);
    formData.append('institute_id', data.institute_id);
    formData.append('duration', data.duration);
    formData.append('instructions', data.instructions);
    formData.append('coordinator_name', data.coordinator_name);
    formData.append('coordinator_designation', data.coordinator_designation);
    formData.append('class_id', data.class_id);
    formData.append('institute_id', data.institute_id);
    
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
    // console.log("this.data.data",this.data.data.duration.substring(9, 15));
    if(this.data.data){
    
      this.formItemsData.patchValue({
        exam_type: this.data.data.exam_type,
        duration: this.data.data.duration,
        time: this.data.data.time,
        subject: this.data.data.subject,
        center: this.data.data.center,
        coordinator_name: this.data.data.coordinator_name,
        coordinator_designation: this.data.data.coordinator_designation,
        date: this.data.data.date,
        class_id: Number(this.data.data.class_id),
        instructions:this.data.data.instructions,
        status: this.data.data.status,
      });
      
    }
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



}
