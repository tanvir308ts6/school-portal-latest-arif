import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ContentArchiveDetailsComponent } from './content-archive-details/content-archive-details.component';
import { ContentArchiveFormComponent } from './content-archive-form/content-archive-form.component';

@Component({
  selector: 'app-content-archive',
  templateUrl: './content-archive.component.html',
  styleUrls: ['./content-archive.component.scss'],
})
export class ContentArchiveComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.searchParam = this.formBuild.group({
      category_id: [],
      topic_id: [],
      title: [],
    });
  }

  tableStructure: any = {
    headers: ['id', 'title', 'category.title', 'topic.title', 'actions'],
    banned: ['Sl No', 'Title', 'Subject', 'Topic', 'Actions'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
  ];
  table_reload: boolean = false;

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

  ngOnInit(): void {
    this.getCategoryDropdown();
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
    const dialogRef = this.dialog.open(ContentArchiveFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          category: this.categoryDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
    dialogRef.componentInstance.onModifyEvent.subscribe((result) => {
      if(result === 'class/content-category'){
        this.getCategoryDropdown();
      }else if(result === 'class/content-topic'){
        this.getTopicDropdown();
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('class/content-archive', data).subscribe(
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
    const dialogRef = this.dialog.open(ContentArchiveFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          category: this.categoryDropdown,
          status: this.statusDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(this.api.getAsFormData(result.value), data.id, dialogRef);
      }
    });
    dialogRef.componentInstance.onModifyEvent.subscribe((result) => {
      if(result === 'class/content-category'){
        this.getCategoryDropdown();
      }else if(result === 'class/content-topic'){
        this.getTopicDropdown();
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`class/content-archive/${id}`, data).subscribe(
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
        title: 'Do you want to delete content?',
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
    this.api.delete('class/content-archive/', id).subscribe(
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
    const dialogRef = this.dialog.open(ContentArchiveDetailsComponent, {
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
    }
  }
}
