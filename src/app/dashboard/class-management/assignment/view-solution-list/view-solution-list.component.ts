import { Component, OnInit, ViewChild,EventEmitter,Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-solution-list',
  templateUrl: './view-solution-list.component.html',
  styleUrls: ['./view-solution-list.component.scss']
})
export class ViewSolutionListComponent implements OnInit {
  private baseUrl: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  subscriptionList: Array<Subscription> = [];
onSubmitEvent = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ViewSolutionListComponent>,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private sessPass: SessionDataPassService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.baseUrl = environment.base_url;
  }
  classDropdown: any[] = [];
  displayedColumns: string[] = [
   
  'id',
  'name',
  'roll',
  'email',
  'actions',
  'mark'
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
      { pagination: true, search: true,assignment_id:this.data.data.id },
      true
      );

    this.api
    .get(`class/assignment-solution` + searchData['searchData'])
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

  actionForDownload(data:any){
   let url = `${this.baseUrl}api/public-portal/content/${data.file_id}`
    window.open(`${url}`);
  }
  actionForAdd(){
    let prevArr: any[] = this.dataSource.data;
    let evaluations = prevArr.filter((res)=>res.obtained_marks).map((res)=>{
      return{
        id:res.id,
        obtained_marks:res.obtained_marks
      }
    });
    console.log(evaluations);
    let param = {
      evaluations:evaluations
    }
    this.onSubmitEvent.emit(param);
  }
}
