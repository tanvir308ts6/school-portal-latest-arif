import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-class-section-subject-form',
  templateUrl: './class-section-subject-form.component.html',
  styleUrls: ['./class-section-subject-form.component.scss'],
})
export class ClassSectionSubjectFormComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  formItemsData: FormGroup;
  searchParam: FormGroup;
  preSelected: any[] = [];

  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();

  teacherDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ClassSectionSubjectFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      subjects: [[]],
    });
    this.searchParam = formBuild.group({
      title: [],
      code: [],
      status: [1],
    });
    this.teacherDropdown = data?.dropdowns?.teacher;
  }

  tableStructure: any = {
    headers: [
      'select',
      'id',
      'title',
      'code',
    ],
    banned: ['select', 'Sl No', 'Title', 'Code'],
  };
  table_reload: boolean = false;

  setFormValue(form: FormGroup, control: string, value: any) {
    form.controls[control].setValue(value);
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data: any) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data: any) => {});
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  setDataForEdit(control?: boolean) {
    if(this.data?.data){
      this.preSelected = this.data?.data?.subject.map((tada: any) => {return {id: tada?.subject_id}})
    }
  }

  actionFromTables(event: any) {
    if (event.action === 'select') {
      this.setFormValue(
        this.formItemsData,
        'subjects',
        event.data.map((tada: any) => tada?.id)
      );
    }
  }

  resetAction() {
    if (this.data.data) {
      this.setDataForEdit(true);
    } else {
      this.resetForm(this.formItemsData);
    }
  }

  resetForm(form: FormGroup) {
    form.markAsPristine();
    form.markAsUntouched();
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.setValue('');
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
}
