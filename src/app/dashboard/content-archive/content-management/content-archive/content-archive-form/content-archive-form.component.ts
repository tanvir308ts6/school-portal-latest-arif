import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ContentArchiveDetailsComponent } from '../content-archive-details/content-archive-details.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ContentCategoryFormComponent } from '../../content-category/content-category-form/content-category-form.component';
import { ContentTopicFormComponent } from '../../content-topic/content-topic-form/content-topic-form.component';

@Component({
  selector: 'app-content-archive-form',
  templateUrl: './content-archive-form.component.html',
  styleUrls: ['./content-archive-form.component.scss']
})
export class ContentArchiveFormComponent implements OnInit {

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
  onModifyEvent = new EventEmitter();
  editor = ClassicEditor;

  categoryDropdown: any[] = [];
  topicDropdown: any[] = [];
  statusDropdown: any[] = [];

  tableStructure: any = {
    headers: ['id', 'title', 'actions'],
    banned: ['Sl No', 'Title', 'Actions'],
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
  searchParam: any = {
    category_id: -1,
    topic_id: -1,
  };

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ContentArchiveFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = formBuild.group({
      _method: ['POST'],
      category_id: [null],
      topic_id: [null],
      description: [''],
      title: [''],
      upload_content: [null],
      status: [1],
      keyword: ['']
    });
    this.categoryDropdown = data?.dropdowns?.category;
    this.statusDropdown = data?.dropdowns?.status;
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

  getTopicDropdown(has_action: boolean) {
    if (has_action) {
      this.clearFormControl('topic_id');
    }
    let tempSearch: any = {
      category_id: this.formItemsData.value.category_id,
    };
    this.api
      .get(
        `class/content-topic?page=0&size=-1&search=${this.api.getSearchData(
          tempSearch
        )}`
      )
      .subscribe((response: any) => {
        this.topicDropdown = response?.data?.data;
      });
    if (has_action) {
      this.searchParamSet('category');
    }
  }

  clearFormControl(control: string) {
    this.formItemsData.controls[control].setValue(null);
  }

  searchParamSet(control?: string) {
    if (control === 'category') {
      this.searchParam.category_id = this.formItemsData.value.category_id
        ? this.formItemsData.value.category_id
        : -1;
      this.searchParam.topic_id = 0;
    } else if (control === 'topic') {
      this.searchParam.topic_id = this.formItemsData.value.topic_id
        ? this.formItemsData.value.topic_id
        : 0;
    } else {
      this.searchParam.category_id = this.formItemsData.value.category_id
        ? this.formItemsData.value.category_id
        : -1;
      this.searchParam.topic_id = this.formItemsData.value.topic_id
        ? this.formItemsData.value.topic_id
        : 0;
    }
    this.reloadTable();
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
        category_id: Number(this?.data?.data?.category_id),
        topic_id: Number(this?.data?.data?.topic_id),
        title: this?.data?.data?.title,
        description: this?.data?.data?.description,
        keyword: this?.data?.data?.keyword,
        _method: 'PUT',
      });
      this.getTopicDropdown(false);
      this.searchParamSet();
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

  loadFile(event: any) {
    if (event.target.files && event.target.files.length) {
      this.formItemsData.controls['upload_content'].setValue(
        event.target.files[0]
      );
    }
  }

  actionForDetails(data: any) {
    const dialogRef = this.dialog.open(ContentArchiveDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: data,
    });
  }

  actionFromTables(event: any) {
    if (event.action === 'details') {
      this.actionForDetails(event.data);
    }
  }

  actionForAdd(type: string){
    if(type){
      if(type === 'Category'){
        const dialogRef = this.dialog.open(ContentCategoryFormComponent, {
          width: `${window.innerWidth}px`,
          disableClose: true,
          data: {
            dropdowns: {},
          },
        });
        dialogRef.componentInstance.onSubmitEvent.subscribe((response: any) => {
          if(response != null){
            this.loaderService.setLoaderStatus(true);
            this.addData('class/content-category', response.value, dialogRef);
          }else{
            dialogRef.close();
          }
        })
      }else if(type === 'Topic'){
        const dialogRef = this.dialog.open(ContentTopicFormComponent, {
          width: `${window.innerWidth}px`,
          disableClose: true,
          data: {
            dropdowns: {
              category: this.categoryDropdown,
            },
          },
        });
        dialogRef.componentInstance.onSubmitEvent.subscribe((response: any) => {
          if(response != null){
            this.loaderService.setLoaderStatus(true);
            this.addData('class/content-topic', response.value, dialogRef);
          }else{
            dialogRef.close();
          }
        })
      }
    }
  }

  addData(api_url: string, data: any, dialog: any){
    this.api.post(api_url, data).subscribe(
      (response) => {
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(true);
        this.setAndAddData(api_url, response?.data);
        this.onModifyEvent.emit(api_url);
        dialog.close();
      },
      (error) => {
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  setAndAddData(control: string, data: any){
    if(control === 'class/content-category'){
      this.categoryDropdown.push(data);
      this.formItemsData.controls['category_id'].setValue(data?.id);
    }else if(control === 'class/content-topic'){
      this.topicDropdown.push(data);
      this.formItemsData.controls['topic_id'].setValue(data?.id);
    }
  }

}
