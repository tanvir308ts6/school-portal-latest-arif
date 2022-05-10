import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { AssignmentFormComponent } from './assignment-form/assignment-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentSolutionComponent } from './assignment-solution/assignment-solution.component';
import { ViewSolutionListComponent } from './view-solution-list/view-solution-list.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {

   @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
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
       title: [],
      type: [],
      description: [''],
      class_unique_code: [''],
      deadline: [''],
      marks: [''],
      uploading_type: [''],
      archive_id: [''],
      upload_assignment: [''],
      // status: ["1" , checkRequired('Status')],
    });
  }
  class_unique_code:any;
  classSubjectDropdown:any[]=[];
  tableStructure: any = {
    headers: [
      'id',
      'title',
      'deadline',
      'marks',
      'actions',
    ],
    banned: [
      'Sl No',
      'Title',
      'Deadline',
      'Marks',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
    },
     {
      tooltip: 'view',
      action: 'details',
      icon: 'visibility',
      color: 'primary',
    },
    {
      tooltip: 'Upload Solution',
      action: 'solution',
      icon: 'input',
      color: 'primary',
    },
    {
      tooltip: 'Assignment Solutions',
      action: 'showSolutions',
      icon: 'pending',
      color: 'primary',
    },
   
  ];
  table_reload: boolean = false;

  instituteDropdown: any[] = [];
  archiveDropdown: any[] = [];

  categoryDropdown: any[] = [];

  statusDropdown: any[] = [
    {
      id: '0',
      text: 'Inactive',
    },
    {
      id: '1',
      text: 'Active',
    },
  ];

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.api.get('class/class-subject').subscribe((response) => {
      this.classSubjectDropdown = response.data.data;
      this.getRouteParameters();
    });
    this.api.get('class/content-archive').subscribe((response) => {
      this.archiveDropdown = response.data.data;
    });
    ;
    
  }
   getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      this.class_unique_code = this.classSubjectDropdown.find((sub: any) => {
        return sub?.class_unique_code === params.get('id');

      });
      console.log('this.class_unique_code',this.class_unique_code);
      this.searchParam.controls['class_unique_code'].setValue(this.class_unique_code?.class_unique_code);
      this.reloadTable();
    });
  }
  changeRoute() {
    this.searchParam.value.class_unique_code
      ? this.router.navigate([
          '/dashboard/class-management/assignment',
          { id: this.searchParam.value.class_unique_code },
        ])
      : this.router.navigate([
          '/dashboard/class-management/assignment',
        ]);
  }

  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
    });
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

  actionForAdd() {
    const dialogRef = this.dialog.open(AssignmentFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          classSubjectDropdown:this.classSubjectDropdown,
          archiveDropdown:this.archiveDropdown,

        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      console.log('Result Assignment Solution',result);
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result, dialogRef);
      }
    });
  }
  actionForViewDetail(data:any) {
    const dialogRef = this.dialog.open(ViewDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
       data: {
        data: data,
      },
    });
  
  }
  addData(data: any, dialogRef: any) {
    console.log('data', data);
    this.api.post('class/assignment', data).subscribe(
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
    const dialogRef = this.dialog.open(AssignmentFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          classSubjectDropdown:this.classSubjectDropdown,
          archiveDropdown:this.archiveDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editInventoryCategory(result, data.id, dialogRef);
      }
    });
  }

  actionForUploadSolution(data: any) {
    const dialogRef = this.dialog.open(AssignmentSolutionComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          classSubjectDropdown:this.classSubjectDropdown,
          archiveDropdown:this.archiveDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        console.log(' onSubmitEvent',result);
        this.loaderService.setLoaderStatus(true);
        this.addSolution(result.formData, result?.id, dialogRef);
      }
    });
  }
  addSolution(data: any, id:any, dialogRef: any) {
    console.log('data', data);


    if(id){
      this.api.post(`class/assignment-solution/${id}`, data).subscribe(
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
    else{

    this.api.post('class/assignment-solution', data).subscribe(
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
  }
  actionForSeeSolutions(data:any){
      const dialogRef = this.dialog.open(ViewSolutionListComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          category: this.categoryDropdown,
          classSubjectDropdown:this.classSubjectDropdown,
          archiveDropdown:this.archiveDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addMarks(result, data.id, dialogRef);
      }
    });

  }
  addMarks(data: any, id: number, dialogRef: any){
     this.api.update(`class/assignment-evaluation/${id}`, data).subscribe(
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
  editInventoryCategory(data: any, id: number, dialogRef: any) {
    this.api.post(`class/assignment/${id}`, data).subscribe(
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
        title: 'Do you want to delete location?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteInventoryCategory(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }
  deleteInventoryCategory(id: number, dialogRef: any) {
    this.api.delete('class/assignment/', id).subscribe(
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

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }
 actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } 
    if (event.action === 'details') {
      this.actionForViewDetail(event.data);
    } 
     if (event.action === 'solution') {
      this.actionForUploadSolution(event.data);
    }
     if (event.action === 'showSolutions') {
      this.actionForSeeSolutions(event.data);
    }
  }
 
}
