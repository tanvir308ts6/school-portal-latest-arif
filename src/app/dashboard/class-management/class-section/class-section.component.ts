import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ClassSectionFormComponent } from './class-section-form/class-section-form.component';
import { ClassSectionSubjectFormComponent } from './class-section-subject-form/class-section-subject-form.component';

@Component({
  selector: 'app-class-section',
  templateUrl: './class-section.component.html',
  styleUrls: ['./class-section.component.scss'],
})
export class ClassSectionComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  reloadOff: boolean = true;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private sassData: SessionDataPassService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.searchParam = this.formBuild.group({
      title: [''],
      institute_id: [''],
      session_id: [''],
      offered_class_id: [null]
    });
    this.sassData.getSession.subscribe((sess: any) => {
      this.searchParam.controls['session_id'].setValue(sess);
      this.getClassDropdown(this.searchParam.value.session_id);
      // this.reloadTable();
    });
  }

  get cusSearchParam(): any{
    return {
      title: this.searchParam.value.title,
      institute_id: this.searchParam.value.institute_id,
      offered_class_id: this.searchParam.value.offered_class_id,
    };
  }

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

  instituteDropdown: any[] = [];
  sessionDropdown: any[] = [];
  classDropdown: any[] = [];
  sectionDropdown: any[] = [];
  groupDropdown: any[] = [];
  shiftDropdown: any[] = [];
  teacherDropdown: any[] = [];

  tableStructure: any = {
    headers: [
      'id',
      'offered_class.session.title',
      'offered_class.class.title',
      'shift.title',
      'group.title',
      'section.title',
      'actions',
    ],
    banned: ['Sl No', 'Session', 'Class', 'Shift', 'Group', 'Section', 'Actions'],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
      condition: () => this.searchParam.value.session_id ? false : true
    },
    {
      tooltip: 'Adjust Subjects',
      action: 'adjust',
      icon: 'library_books',
      color: 'accent',
      condition: () => this.searchParam.value.session_id ? false : true
    },
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'primary',
    },
    {
      tooltip: 'Routine',
      action: 'routine',
      icon: 'calendar_today',
      color: 'accent',
      condition: () => this.searchParam.value.session_id ? false : true
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
      condition: () => this.searchParam.value.session_id ? false : true
    },
  ];
  table_reload: boolean = false;

  get class_unique_id(){
    return this.searchParam.value.offered_class_id;
  }

  changeRoute() {
    this.class_unique_id
      ? this.router.navigate([
          '/dashboard/class-management/class-section',
          { id: this.class_unique_id },
        ])
      : this.router.navigate([
          '/dashboard/class-management/class-section',
        ]);
    this.reloadOff = false;
    this.reloadTable();
  }

  reRouteToUrl(route: string, params:any){
    this.router.navigate([
      route, params
    ]);
  }

  getRouteParameters() {
    this.route.paramMap.subscribe((params) => {
      let class_unique_id: number = Number(params.get('id'));
      if(class_unique_id !== NaN){
        this.searchParam.controls['class_id'].setValue(class_unique_id);
        this.reloadOff = false;
        this.reloadTable();
      }
    });
  }

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.getSectionDropdown();
    this.getGroupDropdown();
    this.getShiftDropdown();
    this.getTeacherDropdown();
    this.loaderService.setSubmissionStatus(true);
  }

  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response: any) => {
      this.instituteDropdown = response.data.data;
    });
  }

  getClassDropdown(session_id: number){
    let url: string = session_id
      ? `class/offered-class?page=0&size=1&search=${this.api.getSearchData({
          session_id: session_id,
        })}`
      : 'class/offered-class?page=0&size=1';
    this.api.get(url).subscribe((response: any) => {
      this.classDropdown = response.data.data;
      this.getRouteParameters();
    });
  }

  getSectionDropdown(){
    this.api.get('settings/section').subscribe((response: any) => {
      this.sectionDropdown = response.data.data;
    });
  }

  getGroupDropdown(){
    this.api.get('settings/group').subscribe((response: any) => {
      this.groupDropdown = response.data.data;
    });
  }

  getShiftDropdown(){
    this.api.get('settings/shift').subscribe((response: any) => {
      this.shiftDropdown = response.data.data;
    });
  }

  getTeacherDropdown(){
    let tempSearch = {
      type: 'Teacher'
    }
    this.api.get(`user/employee?page=0&size=-1&search=${this.api.getSearchData(tempSearch)}`).subscribe((response: any) => {
      this.teacherDropdown = response.data.data;
    })
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

  actionForAdd() {
    const dialogRef = this.dialog.open(ClassSectionFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          session: this.sessionDropdown,
          institute: this.instituteDropdown,
          class: this.classDropdown,
          shift: this.shiftDropdown,
          group: this.groupDropdown,
          section: this.sectionDropdown,
          teacher: this.teacherDropdown,
        },
        preData: {
          session_id: this.searchParam.value.session_id,
          class_id: this.searchParam.value.class_id,
          subjects: this.classDropdown.find((tada: any) => tada.id === this.searchParam.value.offered_class_id)?.subject
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result.value, dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('class/offered-section', data).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(ClassSectionFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          session: this.sessionDropdown,
          institute: this.instituteDropdown,
          class: this.classDropdown,
          shift: this.shiftDropdown,
          group: this.groupDropdown,
          section: this.sectionDropdown,
          teacher: this.teacherDropdown
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(result.value, data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.update(`class/offered-section/${id}`, data).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error: any) => {
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
        title: 'Do you want to remove section from class for session?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteData(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  deleteData(id: number, dialogRef: any) {
    this.api.delete('class/offered-section/', id).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      }
    );
  }

  actionForBulkSubjectAdd(data?: any){
    const dialogRef = this.dialog.open(ClassSectionSubjectFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          teacher: this.teacherDropdown
        }
      }
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if(result.value){
        this.addBulkSubject({...data, ...result.value}, data?.id, dialogRef);
      }
    })
  }

  addBulkSubject(data: any, id: number, dialog: any){
    this.api.update(`class/offered-section/${id}`, data).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      let tempData: any = {
        id: event.data.id
      }
      this.reRouteToUrl('/dashboard/class-management/class-section-details', tempData);
    } else if (event.action === 'adjust') {
      this.actionForBulkSubjectAdd(event.data);
    } else if (event.action === 'routine') {
      let tempData: any = {

      }
      this.reRouteToUrl('/dashboard/class-management/class-routine', tempData);
    }
  }
}
