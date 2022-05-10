import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkNoSpecialChar, checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-section-change-form',
  templateUrl: './section-change-form.component.html',
  styleUrls: ['./section-change-form.component.scss'],
})
export class SectionChangeFormComponent implements OnInit {
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
  editor = ClassicEditor;
  onSubmitEvent = new EventEmitter();
  sectionDropdown: any[] = [];
  classDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: 'inactive',
      text: 'Inactive',
    },
    {
      id: 'active',
      text: 'Active',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<SectionChangeFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      name: ['', [checkRequired('name'), checkNoSpecialChar('name')]],
      class_roll: [
        '',
        [checkRequired('roll'), checkNoSpecialChar('class_roll')],
      ],
      current_section_id: ['', checkRequired('Section')],
      class_id: ['', checkRequired('Class')],
      section_id: ['', checkRequired('Section')],
      new_roll: ['', checkRequired('Roll')],
      status: ['1', checkRequired('Status')],
    });
  }

  ngOnInit(): void {
    console.log(this.data.data);
    this.setDataForEdit(true);
    this.api
      .get('settings/section')
      .subscribe((response) => {
        // console.log(response.section.data);
        this.sectionDropdown = response.data?.data;
      });
    this.api
      .get(`settings/class?&page=1&size=-1`)
      .subscribe((response) => {
        this.classDropdown = response.data?.data;
      });

    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
  }

  validateForm() {
    console.log(this.formItemsData.value.current_section_id);
    let students: any[] = [];
    console.log(this.data.data);
    let myObj = {
      id: this.data.data.id,
      shift_id:this.data.data.class_shift_id,
      session_id:this.data.data.session_id,
      class_id: this.formItemsData.value.class_id,
      class_roll: this.formItemsData.value.new_roll,
      section_id: this.formItemsData.value.section_id,
      group_id: this.data.data.group_id,
    };
    students.push(myObj);
 
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      let studentData = {
        value: {
          enrollment_process:'Transfer',
          students: students,
        },
      };
      this.onSubmitEvent.emit(studentData);
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        name: this.data.data.name,
        class_roll: this.data.data.class_roll,
        current_section_id: Number(this.data.data.section_id),
        status: this.data.data.status,
        class_id: Number(this.data.data.class_id),
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
