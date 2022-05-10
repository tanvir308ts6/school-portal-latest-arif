import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { SubjectMaterialDetailsComponent } from './subject-material-details/subject-material-details.component';
import { SubjectMaterialFormComponent } from './subject-material-form/subject-material-form.component';

@Component({
  selector: 'app-subject-material',
  templateUrl: './subject-material.component.html',
  styleUrls: ['./subject-material.component.scss'],
})
export class SubjectMaterialComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchParam = this.formBuild.group({
      category_id: [],
      topic_id: [],
      title: [],
    });
  }

  tableStructure: any = {
    headers: ['id', 'archive.title', 'archive.category.title', 'archive.topic.title', 'actions'],
    banned: ['Sl No', 'Title', 'Category', 'Topic', 'Actions'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
  ];
  table_reload: boolean = false;

  subjectDropdown: any[] = [];
  categoryDropdown: any[] = [];
  topicDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: 1,
      title: 'Active',
    },
    {
      id: 0,
      title: 'Inactive',
    },
  ];
  tableDataList: any[] = [];

  first_reload_off: boolean = true;
  class_unique_code: any;
  get query_params(): any {
    return {
      type: 'Specific',
      class_unique_code: this.class_unique_code?.class_unique_code,
    };
  }

  showBackendMessage(response: any) {
    let snackbarRef = this.dialog.open(SnackberMessageComponent, {
      position: {
        top: '0px',
        right: '0px',
      },
      data: response,
    });
  }

  resetSearch() {
    this.searchParam.reset();
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  changeRoute() {
    this.class_unique_code?.class_unique_code
      ? this.router.navigate([
          '/dashboard/class-management/subject-material',
          { id: this.class_unique_code?.class_unique_code },
        ])
      : this.router.navigate([
          '/dashboard/class-management/subject-material',
        ]);
    this.reloadTable();
  }

  getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      this.class_unique_code = this.subjectDropdown.find((sub: any) => {
        return sub?.class_unique_code === params.get('id');
      });
      if(this.class_unique_code){
        this.first_reload_off = false;
        this.reloadTable();
      }
    });
  }

  ngOnInit(): void {
    this.getCategoryDropdown();
    this.getSubjectDropdown();
  }

  getSubjectDropdown() {
    this.api
      .get('class/class-subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
        this.getRouteParameters();
      });
  }

  getCategoryDropdown() {
    this.api
      .get('class/content-category?page=0&size=-1')
      .subscribe((response: any) => {
        this.categoryDropdown = response?.data?.data;
      });
  }

  getTopicDropdown() {
    let tempSearch: any = {
      category_id: this.searchParam.value.category_id,
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
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(SubjectMaterialFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        selects: this.tableDataList,
        permanent: this.class_unique_code,
        dropdowns: {
          category: this.categoryDropdown,
          topic: this.topicDropdown,
          status: this.statusDropdown,
          classSubject: this.subjectDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('class/subject-material', data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(SubjectMaterialFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        permanent: this.class_unique_code,
        dropdowns: {
          category: this.categoryDropdown,
          topic: this.topicDropdown,
          status: this.statusDropdown,
          classSubject: this.subjectDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(this.api.getAsFormData(result.value), data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`class/subject-material/${id}`, data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to delete subject material?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteData(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  deleteData(id: number, dialogRef: any) {
    this.api.delete('class/subject-material/', id).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      }
    );
  }

  actionForDetails(tada: any) {
    const dialogRef = this.dialog.open(SubjectMaterialDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: tada,
    });
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    } else if (event.action === 'all_data') {
      this.tableDataList = event.data;
    }
  }

  reRouteToUrl(event: string) {
    if (event === 'sub_det') {
      this.router.navigate([
        '/dashboard/class-management/class-subject-details',
        { id: this.class_unique_code?.class_unique_code },
      ]);
    }
  }
}
