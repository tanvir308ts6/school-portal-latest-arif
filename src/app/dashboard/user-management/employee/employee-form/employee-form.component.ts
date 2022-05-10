import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkRequired ,checkEmail} from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  
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
  file: any;
  statusDropdown: any[] = [];
  instituteDropdown: any[] = [];
  religionDropdown: any[] = [];
  // departmentDropdown: any[] = [
  // {
  //     id:1,
  //     title:
 
  // }
  //    ];
  superVisorDropdown: any[] = [];
  designationDropdown: any[] = [];
  bloodGroupDropdown: any[] = [
    {
      text:"A+"
    },
    {
      text:"A-"
    },
    {
      text:"B+"
    },
    {
      text:"B-"
    },
    {
      text:"AB+"
    },
    {
      text:"AB-"
    },
    {
      text:"O+"
    },
    {
      text:"O-"
    },
  ];
  nationalityDropdown: string[] = [];
   genderDropdown: any[] = [
    {
      text:"Male"
    },
    {
      text:"Female"
    },
    {
      text:"Others"
    }
  
  ];
  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({

      name: ['', checkRequired('Name')],
      father_name: ['', checkRequired('Father name')],
      mother_name: ['', checkRequired('Mother name')],
      institute_id: ['', checkRequired('Institute')],
      email: ['', checkRequired('Email')],
      mobile_no: ['', checkRequired('Mobile no')],
      // nid: ['', checkRequired('Nid')],
      blood_group:[],
      birth_date:['', checkRequired('Date of Birth')],
      nationality:['', checkRequired('Nationality')],
      gender:['', checkRequired('gender')],
      religion_id:['', checkRequired('religion')],
      present_address:['', checkRequired('present address')],
      permanent_address:['', checkRequired('permanent address')],
      office_room:['', checkRequired('office room')],
      employee_code:['', checkRequired('employee code')],
      joining_date:['', checkRequired('joining date')],
    
      supervisor_id:[],
      designation_id:['', checkRequired('designation')],
      type:['Teacher'],
      status: [1, checkRequired('Status')],
    });
    this.statusDropdown = data.dropdowns.status;
    this.instituteDropdown = data.dropdowns.institute;
    this.nationalityDropdown = data?.dropdowns?.nationality;
  }

  ngOnInit(): void {
    this.api.get('settings/religion').subscribe((response) => {
      this.religionDropdown = response.data.data;
    });
    console.log(this.data.data);
    //  this.api.get('settings/department').subscribe((response) => {
    //   this.departmentDropdown = response.data.data;
    // });
     this.api.get('settings/designation').subscribe((response) => {
      this.designationDropdown = response.data.data;
    });
   
    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {

    })
  }
  loadFile(event: any) {
    // console.log(event,this.file );
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
      console.log(event,this.file );
    }
  }
  validateForm2() {

    if(this.formItemsData.value.birth_date){
      let val = this.formItemsData.value['birth_date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['birth_date'].setValue(val);
    }
    if(this.formItemsData.value.joining_date){
      let val = this.formItemsData.value['joining_date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['joining_date'].setValue(val);
    }
    console.log(this.formItemsData.value.birth_date);
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    
    if (this.formItemsData.valid) {
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  validateForm(){
    
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
      if(this.formItemsData.value.birth_date){
      let val = this.formItemsData.value['birth_date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['birth_date'].setValue(val);
    }
    if(this.formItemsData.value.joining_date){
      let val = this.formItemsData.value['joining_date'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['joining_date'].setValue(val);
    }
    let data = this.formItemsData.value;
    console.log("data,data",data);
    let formData = new FormData();

    if (this.file) {
      formData.append('upload_profile', this.file, this.file.name);
    }  
   
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobile_no', data.mobile_no);
    formData.append('institute_id', data.institute_id);
    formData.append('father_name', data.father_name);
    formData.append('mother_name', data.mother_name);
    formData.append('blood_group', data.blood_group);
    formData.append('birth_date', data.birth_date);
    formData.append('nationality', data.nationality);
    formData.append('gender', data.gender);
    formData.append('religion_id', data.religion_id);
    formData.append('present_address', data.present_address);
    formData.append('permanent_address', data.permanent_address);
    formData.append('office_room', data.office_room);
    formData.append('employee_code', data.employee_code);
    formData.append('joining_date', data.joining_date);
    // formData.append('department_id', data.department_id);
    formData.append('supervisor_id', data.supervisor_id);
    formData.append('designation_id', data.designation_id);
    formData.append('type', data.type);    
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

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        name: this.data.data.name,
        father_name: this.data.data.father_name,
        mother_name: this.data.data.mother_name,
        institute_id: Number(this.data.data.institute_id),
        email: this.data.data.email,
        mobile_no: this.data.data.mobile_no,
        blood_group: this.data.data.blood_group,
        birth_date: this.data.data.birth_date,
        nationality: this.data.data.nationality,
        gender: this.data.data.gender,
        religion_id: Number(this.data.data.religion_id),
        present_address: this.data.data.present_address,
        permanent_address: this.data.data.permanent_address,
        office_room: this.data.data.office_room,
        employee_code: this.data.data.employee_code,
        joining_date: this.data.data.joining_date,
        department_id:Number (this.data.data.department_id),
        supervisor_id: this.data.data.supervisor_id,
        designation_id: this.data.data.designation_id,
        type: this.data.data.type,
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
