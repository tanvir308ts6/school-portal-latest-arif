import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { PromoteStudentFormComponent } from './promote-student-form/promote-student-form.component';
import { SectionChangeFormComponent } from './section-change-form/section-change-form.component';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.scss'],
})
export class EnrollStudentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  subscriptionList: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private sessPass: SessionDataPassService,
    ) {
    this.searchParam = this.formBuild.group({
      name: [''],
      class_roll: [''],
      class_id: [],
      section_id: [],
    });
    this.subscriptionList.push(this.sessPass.getSession.subscribe((result: number) => {
      this.session_id = result;
      this.getDataFromApi()
    })
    )
  }
  classDropdown: any[] = [];
  displayedColumns: string[] = [
  'checkbox',
  'id',
  'name',
  'roll',
  'section',
  'class',
  'status',
  'actions'
  ];
  dataSource = new MatTableDataSource();
  statusDropdown: any[] = [
  {
    id: 'inactive',
    text: 'Inactive',
  },
  {
    id: 'active',
    text: 'Active',
  },
  ];

  sectionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  groupDropdown:any[]=[];
  shiftDropdown:any[]=[];
  selectedSessionData:any[]=[];
  session_id:any;
  parentCheck: boolean = false;
  pageStat: boolean = false;
  dummydata: any[] = [
  {
    name: 'Shanita',
    roll: '01',
    status: 1,
  },
  {
    name: 'Bindi',
    roll: '02',
    status: 1,
  },
  {
    name: 'Nirob',
    roll: '03',
    status: 1,
  },
  {
    name: 'Alishba',
    roll: '04',
    status: 1,
  },
  ];
  searchString = '';
  sessionObj:any;
  classObj:any;
  size = 10;
  page = 1;
  total = null;
  paginateStartNo = 0;
  loaderStatus = false;

  ngOnInit(): void {

    this.api
    .get(`settings/shift?&page=1&size=-1`)
    .subscribe((response) => {
      this.shiftDropdown = response.data.data;
    });
    this.api
    .get(`settings/group?&page=1&size=-1`)
    .subscribe((response) => {
      this.groupDropdown = response.data.data;
    });
    
    this.api
    .get(`settings/class?&page=1&size=-1`)
    .subscribe((response) => {
      this.classDropdown = response.data.data;
    });
    this.api
    .get('settings/section')
    .subscribe((response) => {
      this.sectionDropdown = response?.data?.data;
    });
    this.api
    .get('settings/session')
    .subscribe((response) => {
      this.sessionDropdown = response?.data?.data;
    });

    // this.getDataFromApi();

    this.loaderService.setSubmissionStatus(true);
    
  }
  ngOnDestroy(){
    this.subscriptionList.forEach(subs => {
      subs.unsubscribe()
    })
  }

  changePagination(event: any) {
    if (event) {
      this.pageStat = true;
    }
    let pageData = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
    };
    this.storage.setFilterData(pageData);
    this.getDataFromApi();
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

  
  onbgclick(event: any) {
    if (event.checked) {
      this.dataSource.data.forEach((data: any) => {
        return (data.check = true);
      });
    } else {
      this.dataSource.data.forEach((data: any) => {
        return (data.check = false);
      });
    }
  }
  onSingleclick(datas: any, eve: any) {
    if (eve.checked == false) {
      this.parentCheck = false;
    }
    if (eve.checked == true) {
    }
  }
  getDataFromApi() {
    console.log(this.session_id);
    // this.dataSource = new MatTableDataSource(this.dummydata);
    this.loaderStatus = true;
    this.searchString = this.api.getSearchData(this.searchParam.value);
    this.storage.setFilterData({
      search: this.searchString ? this.searchString : 'clear',
    });
    let searchData = this.api.getFilterData(
      { pagination: true, search: true,session_id:this.session_id },
      true
      );

    this.api
    .get('class/un-enroll-student' + searchData['searchData'])
    .subscribe((response) => {
      this.dataSource = new MatTableDataSource(response?.data?.data);

      this.total = response.data.total;
      this.loaderStatus = false;
      const result = this.sessionDropdown.filter((data) => data.id == this.session_id);
      this.sessionObj = result[0];
      const result2 = this.classDropdown.filter((data) => data.id == this.searchParam.value.class_id);
      this.classObj = result2[0];
      console.log(this.classObj,this.sessionObj)
    }, (error: any) => {
      this.dataSource = new MatTableDataSource();
      this.total = null;
      this.loaderStatus = false;
    });



  }

  actionForAdd(promotiomStat?:any) {
    console.log(promotiomStat);
    const datas: any[] = this.dataSource.data;

    const result = datas.filter((data) => data.check == true);

    console.log(result);
    const dialogRef = this.dialog.open(PromoteStudentFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,

      data: {
        enrollStudentData: result,
        promotionStat:promotiomStat,
        sessionObj:this.sessionObj,
        classObj:this.classObj,
        class_id:this.searchParam.value.class_id,
        dropdowns: {
          session:this.sessionDropdown,
          group:this.groupDropdown,
          shift:this.shiftDropdown,

        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result.value, dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('class/bulk-student-enroll', data).subscribe(
      (response) => {
        this.getDataFromApi();
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
    const dialogRef = this.dialog.open(SectionChangeFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {},
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(result.value, data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`class/bulk-student-enroll`, data).subscribe(
      (response) => {
        this.getDataFromApi();
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
    this.api.delete('class/group-configuration/', id).subscribe(
      (response) => {
        this.getDataFromApi();
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
}
