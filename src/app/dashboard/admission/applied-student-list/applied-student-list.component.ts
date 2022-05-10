import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ApproveElegibleStudentComponent } from './approve-elegible-student/approve-elegible-student.component';
import { AdmitStudentComponent } from './admit-student/admit-student.component';
import { LoaderService } from 'src/app/service/loader/loader.service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdmissionApplyStaffComponent } from './admission-apply-staff/admission-apply-staff.component';
@Component({
  selector: 'app-applied-student-list',
  templateUrl: './applied-student-list.component.html',
  styleUrls: ['./applied-student-list.component.scss'],
})
export class AppliedStudentListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  searchParam2: FormGroup;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.searchParam = this.formBuild.group({
      name_en: [''],
      name_bn: [''],
      contact_no: [],
      admission_roll: [],
      email: [],
      class_id: [],
      applicants_status: [],
      apply_process: [],
    });
    this.searchParam2 = this.formBuild.group({
      is_admission: [1],
    });
  }
  displayedColumns: string[] = [
    'id',
    'name_en',
    'name_bn',
    'email',
    'contact_no',
    'applicants_status',
    'apply_process',
    'payment_status',
    'actions',
  ];
  currentTab: number = 0;
  dataSource = new MatTableDataSource();
  instituteDropdown: any[] = [];
  classDropdown: any[] = [];
  allDataArr: any[] = [];
  foundAdmissionStat: boolean = false;
  foundAdmissionTestStat: boolean = false;
  searchString = '';
  applicationStatusDropdown: any[] = [
    {
      text: 'Registered',
    },
    {
      text: 'Applied',
    },
    {
      text: 'Eligible for admission',
    },
    {
      text: 'Eligible for admission test',
    },
  ];
  applicationProcessDropdown: any[] = [
    {
      text: 'Online Fill Up',
    },
    {
      text: 'Online Upload',
    },
    {
      text: 'In Person Submission',
    },
  ];
  tableStructure: any = {
    headers: [
      'id',
      'name_en',
      'name_bn',
      'email',
      'contact_no',
      'applicants_status',
      'apply_process',
      'payment_status',
      'actions',
    ],
    banned: [
      'Sl No',
      'Name(In English)',
      'Name(In Bangla)',
      'Email',
      'Contact no',
      'Applicants status',
      'Apply Process',
      'Payment',
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
      tooltip: 'Admit Student',
      action: 'admit',
      icon: 'input',
      color: 'primary',
      condition: (element: any) =>
        element.applicants_status != 'Eligible for admission',
    },
    {
      tooltip: 'Approval',
      action: 'approve',
      icon: 'check_circle',
      color: 'accent',
      condition: (element: any) =>
        element.applicants_status != 'Applied' &&
        element.applicants_status != 'Eligible for admission test',
    },
    {
      tooltip: 'Upload Circular',
      action: 'view',
      icon: 'visibility',
      color: 'accent',
    }
  ];
  table_reload: boolean = false;

  size = 10;
  page = 1;
  total = null;
  paginateStartNo = 0;
  loaderStatus = false;

  ngOnInit(): void {
    this.getClassFromApi();
    this.loaderService.setSubmissionStatus(true);
  }
  changePagination(event: any) {
    let pageData = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
    };
    this.storage.setFilterData(pageData);
    this.actionForTabChange({ index: this.currentTab });
  }
  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }
  actionForView(data: any) {
    const dialogRef = this.dialog.open(ViewDetailsComponent, {
      minWidth: '100%',
      minHeight: '100%',
      height: '100%',
      width: '100%',
      disableClose: false,
      data: {
        data: data,
      },
    });
  }
  actionForApproveElegible(data: any) {
    const dialogRef = this.dialog.open(ApproveElegibleStudentComponent, {
      minWidth: '100%',
      minHeight: '100%',
      height: '100%',
      width: '100%',
      disableClose: false,
      data: {
        data: data,
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe(() => {
      this.loaderService.setLoaderStatus(true);
      this.actionForTabChange({ index: this.currentTab });
    });
  }
  actionForAdmitStudent(data: any) {
    const dialogRef = this.dialog.open(AdmitStudentComponent, {
      minWidth: '100%',
      minHeight: '100%',
      height: '100%',
      width: '100%',
      disableClose: false,
      data: {
        data: data,
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe(() => {
      this.loaderService.setLoaderStatus(true);
      this.actionForTabChange({ index: this.currentTab });
    });
  }
  actionForAdmissionApply(data?: any){
    if(data){
      window.localStorage.setItem('currentStudent', JSON.stringify(data));
      console.log(data);
    }
    const dialogRef = this.dialog.open(AdmissionApplyStaffComponent, {
      width: `${window.innerWidth}px`,
      disableClose: false,
      data: {
      },
    });
  }
  resetSearch() {
    this.searchParam.reset();
  }

  actionForTabChange({ index }: any) {
    this.currentTab = index;
    if (index === 0) {
      this.searchParam.controls['applicants_status'].setValue('');
      this.reloadTable();
    } else if (index === 1) {
      this.searchParam.controls['applicants_status'].setValue('Registered');
      this.reloadTable();
    } else if (index === 2) {
      this.searchParam.controls['applicants_status'].setValue('Applied');
      this.reloadTable();
    } else if (index === 3) {
      this.searchParam.controls['applicants_status'].setValue(
        'Eligible for admission'
      );
      this.reloadTable();
    } else if (index === 4) {
      this.searchParam.controls['applicants_status'].setValue(
        'Eligible for admission test'
      );
      this.reloadTable();
    } else if (index === 5) {
      this.searchParam.controls['applicants_status'].setValue('Not Approved');
      this.reloadTable();
    }
  }

  getDataFromApi() {
    this.loaderStatus = true;
    this.searchString = this.api.getSearchData(this.searchParam.value);
    this.storage.setFilterData({
      search: this.searchString ? this.searchString : 'clear',
    });
    let searchData = this.api.getFilterData({ pagination: true, search: true });
    this.paginateStartNo = searchData['paginateStartNo'];
    this.api
      .get('admission/manual-application' + searchData['searchData'])
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource(response.data.data);
        this.total = response.data.total;
        this.loaderStatus = false;
      });
  }
  getClassFromApi() {
    this.searchString = this.api.getSearchData(this.searchParam.value);
    this.api
      .get(`settings/class?page=0&size=-1&search=is_admission=1`)
      .subscribe((response) => {
        this.classDropdown = response.data.data;
      });
  }
  actionForAdd() {
    this.router.navigate(['/portal/staff/apply-by-staff']);
  }
  actionForEdit(data: any) {
    this.router.navigate(['/portal/student/student-apply']);
    localStorage.setItem('currentStudent', JSON.stringify(data));
  }

  getClassId(data: any) {
    const foundAdmission = this.allDataArr.find(
      (element) =>
        element.applicants_status == 'Eligible for admission' &&
        element.class_id == data.value
    );
    if (foundAdmission != undefined) {
      this.foundAdmissionStat = true;
    } else {
      this.foundAdmissionStat = false;
    }

    const foundAdmissionTest = this.allDataArr.find(
      (element) =>
        element.applicants_status == 'Eligible for admission test' &&
        element.class_id == data.value
    );
    if (foundAdmissionTest != undefined) {
      this.foundAdmissionTestStat = true;
    } else {
      this.foundAdmissionTestStat = false;
    }
  }
  downloadEligibleForAdmissionList() {
    this.goToLink(
      environment.api_url_admission +
        'api/' +
        `admission/applicant-list-pdf?class_id=${
          this.searchParam.value.class_id
        }&applicants_status=Eligible for admission&institute_id=${
          this.storage.getUserData().instituteId
        }`
    );
  }
  private goToLink(url: string) {
    window.open(url);
  }
  downloadEligibleForAdmissionTestList() {
    this.goToLink2(
      environment.api_url_admission +
        'api/' +
        `admission/applicant-list-pdf?class_id=${
          this.searchParam.value.class_id
        }&applicants_status=Eligible for admission test&institute_id=${
          this.storage.getUserData().instituteId
        }`
    );
  }
  private goToLink2(url: string) {
    window.open(url);
  }
  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForAdmissionApply(event.data);
    } else if (event.action === 'admit') {
      this.actionForAdmitStudent(event.data);
    } else if (event.action === 'approve') {
      this.actionForApproveElegible(event.data);
    } else if (event.action === 'view') {
      this.actionForView(event.data);
    }
  }
}
