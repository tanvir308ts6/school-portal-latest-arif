import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-subject-material-form',
  templateUrl: './subject-material-form.component.html',
  styleUrls: ['./subject-material-form.component.scss'],
})
export class SubjectMaterialFormComponent implements OnInit {
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

  categoryDropdown: any[] = [];
  topicDropdown: any[] = [];
  statusDropdown: any[] = [];
  classSubjectDropdown: any[] = [];
  uploadingTypeDropdown: string[] = [
    'Archive',
    'Upload'
  ];
  currentClassSubject: any;

  tableStructure: any = {
    headers: ['select', 'id', 'title', 'category.title', 'topic.title'],
    banned: ['select', 'Sl No', 'Title', 'Category', 'Topic'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
  ];
  table_reload: boolean = false;
  selectedItems: any;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<SubjectMaterialFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      _method: ['POST'],
      type: ['Specific'],
      class_unique_code: [null],
      uploading_type: [''],
      archive: [[]],
      upload_content: [null],
      status: [1],
    });
    this.searchParam = formBuild.group({
      category_id: [],
      topic_id: [],
    })
    this.currentClassSubject = data?.permanent;
    this.categoryDropdown = data?.dropdowns?.category;
    this.topicDropdown = data?.dropdowns?.topic;
    this.statusDropdown = data?.dropdowns?.status;
    this.classSubjectDropdown = data?.dropdowns?.classSubject;
    this.setRedundentData();
  }

  ngOnInit(): void {
    this.setDataForEdit();
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {});
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  setRedundentData(){
    this.formItemsData.patchValue({
      class_unique_code: this.currentClassSubject?.class_unique_code,
    });
    this.selectedItems = {
      control: 'id',
      items: this.data?.selects?.map((tData: any) => tData.archive)
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        _method: 'PUT',
        subject_id: this.data?.data?.subject_id,
        class_id: this.data?.data?.class_id,
        section_id: this.data?.data?.section_id,
        group_id: this.data?.data?.group_id,
        class_shift_id: this.data?.data?.class_shift_id,
        session_id: this.data?.data?.session_id,
        uploading_type: this.data?.data?.uploading_type,
        status: this.data?.data?.status
      });
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

  setArchive(data: any[]){
    let tempList = data.map((temp: any) => {
      return {
        id: temp.id
      }
    });
    this.formItemsData.controls['archive'].setValue(tempList);
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

  loadFile(event: any) {
    if (event.target.files && event.target.files.length) {
      this.formItemsData.controls['upload_content'].setValue(
        event.target.files[0]
      );
    }
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      // this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      // this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      // this.actionForDetails(event.data);
    } else if (event.action === 'select'){
      this.setArchive(event.data);
    }
  }
}
