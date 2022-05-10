import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-class-section-form',
  templateUrl: './class-section-form.component.html',
  styleUrls: ['./class-section-form.component.scss'],
})
export class ClassSectionFormComponent implements OnInit {
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
  sessionDropdown: any[] = [];
  classDropdown: any[] = [];
  shiftDropdown: any[] = [];
  groupDropdown: any[] = [];
  sectionDropdown: any[] = [];
  teacherDropdown: any[] = [];

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

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ClassSectionFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      session_id: [],
      offered_class_id: [],
      class_shift_id: [],
      group_id: [],
      section_id: [],
      class_teacher_id: [],
      class_room: [],
      subject: [[]],
      status: [1],
      institute_id: [],
    });
    this.sessionDropdown = this.data.dropdowns.session;
    this.classDropdown = this.data.dropdowns.class;
    this.instituteDropdown = this.data.dropdowns.institute;
    this.shiftDropdown = this.data.dropdowns.shift;
    this.groupDropdown = this.data.dropdowns.group;
    this.sectionDropdown = this.data.dropdowns.section;
    this.teacherDropdown = this.data.dropdowns.teacher;
    if(this.instituteDropdown.length === 1){
      this.formItemsData.controls['institute_id'].setValue(this.instituteDropdown[0]?.id)
    }
    if(data?.preData?.session_id){
      this.formItemsData.controls['session_id'].setValue(data?.preData?.session_id);
    }
    if(data?.preData?.class_id){
      this.formItemsData.controls['offered_class_id'].setValue(data?.preData?.class_id);
    }
    if(data?.preData?.subjects){
      this.formItemsData.controls['subject'].setValue(data?.preData?.subjects.map((tada: any) => {return {id: tada?.subject_id}}))
    }
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
        session_id: this.data?.data?.session_id,
        offered_class_id: this.data?.data?.offered_class_id,
        class_shift_id: this.data?.data?.class_shift_id,
        group_id: this.data?.data?.group_id,
        section_id: this.data?.data?.section_id,
        class_teacher_id: this.data?.data?.class_teacher_id,
        class_room: this.data?.data?.class_room,
        status: this.data?.data?.status,
        subject: this.data?.data?.subject,
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
