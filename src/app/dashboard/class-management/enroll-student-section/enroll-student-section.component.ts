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
// import { PromoteStudentFormComponent } from './promote-student-form/promote-student-form.component';
// import { SectionChangeFormComponent } from './section-change-form/section-change-form.component';

@Component({
  selector: 'app-enroll-student-section',
  templateUrl: './enroll-student-section.component.html',
  styleUrls: ['./enroll-student-section.component.scss']
})
export class EnrollStudentSectionComponent implements OnInit {
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
      this.getDataFromApi();
      this.getOfferedClassDropdown();
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

  ];
  dataSource = new MatTableDataSource();
  offerdSectionDropdown: any[] = [];

  sectionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  groupDropdown:any[]=[];
  shiftDropdown:any[]=[];
  offered_section_id:any;
  selectedSessionData:any[]=[];
  session_id:any;
  parentCheck: boolean = false;
  pageStat: boolean = false;
  offeredClassDropdown:any[]=[];
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
  getOfferedClassDropdown(){
    this.api.get(`class/offered-class?search=session_id=${this.session_id}`).subscribe((response) => {
      this.offeredClassDropdown = response.data.data;
      console.log("session_id",this.session_id);
    });
  }
  getDataFromOfferdClass(val:any){

    this.api.get(`class/offered-section?search=offered_class_id=${val.value.id}`).subscribe((response) => {
      this.offerdSectionDropdown = response.data.data;
      console.log("session_id",this.session_id);
    });
  }
  getDataFromOfferdSection(val:any){

    this.offered_section_id=val.value.id;
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
    .get('class/enroll-student' + searchData['searchData'])
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

  addData(data: any, dialogRef: any) {
    let prevArr: any[] = this.dataSource.data;
      let resultArr = prevArr.filter((res)=>res.check == true);
      
      let newArr: any[] = [];
        newArr = resultArr.map(
          ({ id}) => {
            return {
              id: id,              
            };
          }
        );

     let param = {
       students:newArr,
       offered_section_id:this.offered_section_id
     }
    this.api.post(`class/offered-section/${this.offered_section_id}/student`, param).subscribe(
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



}
