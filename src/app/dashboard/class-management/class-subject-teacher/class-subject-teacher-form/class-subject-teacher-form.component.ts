import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-class-subject-teacher-form',
  templateUrl: './class-subject-teacher-form.component.html',
  styleUrls: ['./class-subject-teacher-form.component.scss']
})
export class ClassSubjectTeacherFormComponent implements OnInit {
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

  classSubjectDropdown: any[] = [];
  statusDropdown: any[] = [];
  currentClassSubject: any;

  tableStructure: any = {
    headers: ['select', 'id', 'name', 'office_room'],
    banned: ['select', 'Sl No', 'Name', 'Office Room'],
  };
  tableButtons: any[] = [
    // {
    //   tooltip: 'Details',
    //   action: 'details',
    //   icon: 'remove_red_eye',
    //   color: 'accent',
    // },
  ];
  table_reload: boolean = false;
  selectedItems: any;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ClassSubjectTeacherFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      class_unique_code: [null],
      teachers: [[]],
      status: [1],
    });
    this.searchParam = formBuild.group({
      type: ['Teacher']
    });
    this.currentClassSubject = data?.permanent;
    this.statusDropdown = data?.dropdowns?.status;
    this.classSubjectDropdown = data?.dropdowns?.classSubject;
  }

  resetAction() {
    if (this.data.data) {
      // this.setDataForEdit(true);
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

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  ngOnInit(): void {
    this.setRedundentData();
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {});
  }

  setRedundentData(){
    this.formItemsData.patchValue({
      class_unique_code: this.currentClassSubject?.class_unique_code,
    });
    this.selectedItems = {
      control: 'id',
      items: this.data?.selects?.map((tData: any) => tData.teacher)
    }
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

  setTeachers(data: any[]){
    let tempList = data.map((temp: any) => {
      return {
        id: temp.id
      }
    });
    this.formItemsData.controls['teachers'].setValue(tempList);
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      // this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      // this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      // this.actionForDetails(event.data);
    } else if (event.action === 'select'){
      this.setTeachers(event.data);
    }
  }

}
