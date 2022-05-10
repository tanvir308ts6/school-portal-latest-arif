import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkEmail, checkOnlyDigit, checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
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
  bloodGroupDropdown: string[] = [];
  nationalityDropdown: string[] = [];
  genderDropdown: string[] = [];
  religionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  groupDropdown: any[] = [];
  classDropdown: any[] = [];
  sectionDropdown: any[] = [];
  shiftDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<StudentFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      name: ['', checkRequired('Name')],
      email: ['', [checkEmail('E-Mail')]],
      birth_certificate_no: ['', checkOnlyDigit('Birth Cirtificate Number')],
      mobile_no: ['', checkRequired('Mobile Number')],
      institute_id: [null, checkRequired('Institute')],
      father_name: [''],
      mother_name: [''],
      blood_group: [''],
      birth_date: [''],
      nationality: [''],
      gender: [''],
      religion_id: [null],
      present_address: [''],
      permanent_address: [''],
      student_id: ['', checkRequired('ID')],
      class_roll: [''],
      group_id: [null],
      section_id: [null],
      session_id: [null],
      class_id: [null],
      crvs_id: [''],
      class_shift_id: [null],
      upload_id_card: [new File([], '')],
      upload_profile: [new File([], '')],
      upload_birth_certificate: [new File([], '')],
      _method: ['POST'],
    });
    this.instituteDropdown = this.data?.dropdowns?.institute;
    this.bloodGroupDropdown = this.data?.dropdowns?.bloodGroup;
    this.nationalityDropdown = this.data?.dropdowns?.nationality;
    this.genderDropdown = this.data?.dropdowns?.gender;
    this.religionDropdown = this.data?.dropdowns?.religion;
    this.sessionDropdown = this.data?.dropdowns?.session;
    this.groupDropdown = this.data?.dropdowns?.group;
    this.classDropdown = this.data?.dropdowns?.class;
    this.sectionDropdown = this.data?.dropdowns?.section;
    this.shiftDropdown = this.data?.dropdowns?.shift;
    if(this.instituteDropdown && this.instituteDropdown.length == 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0].id);
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
      if (this.formItemsData.value['birth_date']) {
        this.formItemsData.controls['birth_date'].setValue(
          formatDate(
            this.formItemsData.value['birth_date'],
            'yyyy-MM-dd',
            'en-US'
          )
        );
      }
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        name: this.data?.data?.name,
        email: this.data?.data?.email,
        birth_certificate_no: this.data?.data?.birth_certificate_no,
        mobile_no: this.data?.data?.mobile_no,
        institute_id: Number(this.data?.data?.institute_id),
        father_name: this.data?.data?.father_name,
        mother_name: this.data?.data?.mother_name,
        blood_group: this.data?.data?.blood_group,
        birth_date: this.data?.data?.birth_date,
        nationality: this.data?.data?.nationality,
        gender: this.data?.data?.gender,
        religion_id: Number(this.data?.data?.religion_id),
        present_address: this.data?.data?.present_address,
        permanent_address: this.data?.data?.permanent_address,
        student_id: this.data?.data?.student_id,
        class_roll: this.data?.data?.class_roll,
        group_id: Number(this.data?.data?.group_id),
        section_id: Number(this.data?.data?.section_id),
        session_id: Number(this.data?.data?.session_id),
        class_id: Number(this.data?.data?.class_id),
        crvs_id: this.data?.data?.crvs_id,
        class_shift_id: Number(this.data?.data?.shift?.id),
        _method: 'PUT',
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

  clearField(formData: FormGroup, control: string) {
    formData.controls[control].markAsPristine();
    formData.controls[control].markAsUntouched();
    formData.controls[control].setValue('');
  }

  dynamicallyOpenFile(data: string) {
    document.getElementById(data)?.click();
  }

  loadFile(event: any, control: string) {
    if (event.target.files && event.target.files.length) {
      this.formItemsData.controls[control].setValue(event.target.files[0]);
    }
  }
}
