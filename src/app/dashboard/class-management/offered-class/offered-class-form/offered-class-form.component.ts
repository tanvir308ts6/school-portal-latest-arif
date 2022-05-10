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
  selector: 'app-offered-class-form',
  templateUrl: './offered-class-form.component.html',
  styleUrls: ['./offered-class-form.component.scss'],
})
export class OfferedClassFormComponent implements OnInit {
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
  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();

  classDropdown: any[] = [];
  teacherDropdown: any[] = [];
  statusDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<OfferedClassFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      class_id: [],
      coordinator_id: [],
      session_id: [],
      subjects: [[]],
    });
    this.searchParam = formBuild.group({
      title: [],
      code: [],
      status: [1],
    });
    this.classDropdown = data?.dropdowns?.class;
    this.teacherDropdown = data?.dropdowns?.teacher;
    this.statusDropdown = data?.dropdowns?.status;
    this.setFormItemsData(
      this.formItemsData,
      'session_id',
      data?.preData?.session_id
    );
  }

  tableStructure: any = {
    headers: [
      'select',
      'id',
      'title',
      'code',
      // {
      //   type: 'select_field',
      //   label: 'Teacher',
      //   multiple: true,
      //   model: 'teachers',
      //   required: true,
      //   list: 'teacher',
      //   list_control: 'id',
      //   list_view: 'name',
      // },
    ],
    banned: ['select', 'Sl No', 'Subject', 'Subject Code'],
  };
  tableButtons: any[] = [];
  table_reload: boolean = false;
  preSelected: any[] = [];

  ngOnInit(): void {
    this.setDataForEdit();
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {
      if (!data) {
      }
    });
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  setFormItemsData(form: FormGroup, control: string, value: any) {
    form.controls[control].setValue(value);
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        class_id: Number(this.data?.data?.class_id),
        class_coordinator_id: Number(this.data?.data?.coordinator_id),
        session_id: Number(this.data?.data?.session_id),
      });
      this.preSelected = this.data?.data?.subject.map((tada: any) => {return {...tada, id: tada?.subject_id}});
    }
  }

  validateForm() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      this.setFormItemsData(this.formItemsData, 'subjects', this.preSelected);
      this.onSubmitEvent.emit(this.formItemsData);
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

  getSubjectId(id: number): any | null {
    return this.data?.data?.subjects.find((tada: any) => tada?.subject_id === id) ?? null;
  }

  actionFromTables(event: any) {
    if (event.action === 'select') {
      this.preSelected = event.data.map((tada: any) => {
        let editableId: number | null = this.getSubjectId(tada?.id)?.id;
        return editableId ? { subject_id: tada?.id, id: editableId } : {id: tada?.id};
      });
    }
  }
}
