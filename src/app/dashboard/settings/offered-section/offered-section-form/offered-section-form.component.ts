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

@Component({
  selector: 'app-offered-section-form',
  templateUrl: './offered-section-form.component.html',
  styleUrls: ['./offered-section-form.component.scss'],
})
export class OfferedSectionFormComponent implements OnInit {
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
  instituteDropdown: any[] = [];
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
  classDropdown: any[] = [];
  sectionDropdown: any[] = [];
  groupDropdown: any[] = [];
  sessionDropdown: any[] = [];
  shiftDropdown: any[] = [];
  subjectDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<OfferedSectionFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      institute_id: [],
      class_id: [],
      section_id: [],
      session_id: [data?.preData?.session_id],
      group_id: [],
      status: [],
      subject_id: [],
      class_shift_id: [],
    });
    this.getSectionBySession();
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
    this.classDropdown = this.data.dropdowns.class;
    this.groupDropdown = this.data.dropdowns.group;
    this.instituteDropdown = this.data.dropdowns.institute;
    this.sectionDropdown = this.data.dropdowns.section;
    this.sessionDropdown = this.data.dropdowns.session;
    this.shiftDropdown = this.data.dropdowns.shift;
    this.subjectDropdown = this.data.dropdowns.subject;
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
        title: this.data?.data?.title,
        code: this.data?.data?.code,
        institute_id: this.data?.data?.institute_id,
        class_id: this.data?.data?.academic_class?.id,
        section_id: this.data?.data?.section?.id,
        group_id: this.data?.data?.group?.id,
        status: this.data?.data?.status,
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
  getSectionBySession() {
    let searchString = `session_id=${this.formItemsData.value.session_id}`;
    searchString = encodeURIComponent(searchString);
    this.api
      .get(`settings/section?search=${searchString}`)
      .subscribe((response) => {
        this.sectionDropdown = response.data.data;
      });
  }
  getClassId(val: any) {
    console.log(val.value);
    let result = this.sectionDropdown.filter((obj) => {
      return obj.id === val.value;
    });
    console.log(result);
    this.formItemsData.controls['class_id'].setValue(result[0].class_id);
  }
}
