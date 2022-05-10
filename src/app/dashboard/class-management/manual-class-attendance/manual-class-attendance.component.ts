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
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-manual-class-attendance',
  templateUrl: './manual-class-attendance.component.html',
  styleUrls: ['./manual-class-attendance.component.scss']
})
export class ManualClassAttendanceComponent implements OnInit {
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
      live_class_id:[],
    });
    this.subscriptionList.push(this.sessPass.getSession.subscribe((result: number) => {
      this.session_id = result;
       this.getOfferedClassDropdown();
    })
    )
  }
  classDropdown: any[] = [];
  
  btnTitle:Boolean = false;
  displayedColumns: string[] = [
  'checkbox',
  'id',
  'class',
  'name',
  'roll',
  
  
 
  
  ];
  dataSource = new MatTableDataSource();
  

  sectionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  groupDropdown:any[]=[];
  shiftDropdown:any[]=[];
  offeredClassDropdown:any[]=[];
  liveClassDropdown:any[]=[];
  selectedSessionData:any[]=[];
  offered_section_id:any;
  session_id:any;
  parentCheck: boolean = false;
  pageStat: boolean = false;
  offerdSectionDropdown: any[] = [];
  live_class_id:any;
  searchString = '';
  sessionObj:any;
  classObj:any;
  classObjTitle:any;
  sectionObjTitle:any;
  size = 10;
  page = 1;
  total = null;
  paginateStartNo = 0;
  loaderStatus = false;

  ngOnInit(): void {
   
    this.api
    .get(`class/live-class?type=Open&page=1&size=-1`)
    .subscribe((response) => {
      this.liveClassDropdown = response.data.data;
    });
  
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
  getDataFromOfferdSection(val:any){
    this.offered_section_id=val.value.id;
    // this.getDataFromApi();
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
   getDataFromOfferdClass(val:any){

    this.api.get(`class/offered-section?search=offered_class_id=${val.value.id}`).subscribe((response) => {
      this.offerdSectionDropdown = response.data.data;
      console.log("session_id",this.session_id);
    });
  }
  getDataFromApi() {
    
    this.loaderStatus = true;
   
    this.searchParam.value.session_id = this.session_id;
    this.searchString = this.api.getSearchData(this.searchParam.value);
    this.storage.setFilterData({
      search: this.searchString ? this.searchString : 'clear',
    });
    
    let searchData = this.api.getFilterData(
      {  search: true},
      true
      );
    if(this.searchParam.value.class_id){
      this.classObjTitle = this.classDropdown.find(res=>res.id == this.searchParam.value.class_id).title;
    }
    if(this.searchParam.value.section_id){
      this.sectionObjTitle = this.sectionDropdown.find(res=>res.id == this.searchParam.value.section_id).title;
    }
    this.api
    .get(`class/live-class-student/${this.offered_section_id}?live_class_id=${this.searchParam.value.live_class_id}`)
    .subscribe((response) => {
      let resultArr:any[] = response.data.data;
      let found = resultArr.filter((obj)=>{
        return obj.live_attendance_count === 1;
      })
      let found2 = resultArr.filter((obj)=>{
        return obj.live_attendance_count === 0;
      })
      console.log(found.length);
       if(found.length){
        this.btnTitle = true;
      }
      else{
        this.btnTitle = false;
      }
      if(!found.length || !found2.length){
        this.parentCheck = true;
       
      }

      const newArr = resultArr.map(obj => {
        if (obj.live_attendance_count === 1 || !found.length) {
          return {...obj, check: true};
        }
        return obj;
      });
    
      this.dataSource = new MatTableDataSource(newArr);
      this.total = response.data.total;
      this.loaderStatus = false;
     
    }, (error: any) => {
      this.dataSource = new MatTableDataSource();
      this.total = null;
      this.loaderStatus = false;
    });

  }
  
  actionForAdd() {
    
    const datas: any[] = this.dataSource.data;
    let attendances = datas.map((user)=>{
       return {
         student_id:user.id,
         attendance:user.check?true:false
       };
    })
    
    let param = {
      
      attendances:attendances
    }
    this.addData(param);
  }
  
  addData(data: any) {
     
    this.api.post(`class/live-class-manual-attendance/${this.searchParam.value.live_class_id}`, data).subscribe(
      (response) => {
        this.getDataFromApi();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        // dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
      );
  }

}
