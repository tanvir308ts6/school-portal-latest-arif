import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-daily-attendance-report',
  templateUrl: './daily-attendance-report.component.html',
  styleUrls: ['./daily-attendance-report.component.scss']
})
export class DailyAttendanceReportComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;
  subscriptionList: Array<Subscription> = [];
  session_id:any;
  class_id:any;
  section_id:any;
  class_shift_id:any;
  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sessPass: SessionDataPassService,
    ) {
    this.searchParam = this.formBuild.group({
      category_id: [],
      topic_id: [],
      title: [],
    });
    this.subscriptionList.push(this.sessPass.getSession.subscribe((result: number) => {
      this.session_id = result;
      this.getOfferedClassDropdown();
    })
    )
  }

  
  studentdata:any = [];
  firstElement:any = [];
  firstElementId:any = [];
  secondElement:any = [];
  liveClassData:any = [];
  class_unique_code: any;
  offeredClassDropdown:any[]=[];
  offerdSectionDropdown:any[]=[];
  start_date:any;
  end_date:any;
  get query_params(): any {
    return {
      start_date: this.start_date,
      end_date:this.end_date,
      class_unique_code: this.class_unique_code?.class_unique_code,
    };
  }

  ngOnInit(): void {
    
  }
  getOfferedClassDropdown(){
     this.api.get(`class/offered-class?search=session_id=${this.session_id}`).subscribe((response) => {
      this.offeredClassDropdown = response.data.data;
      console.log("session_id",this.session_id);
    });
  }
  getDataFromOfferdClass(val:any){
    console.log("val",val);
    this.class_id = val.value.class.id;
    this.api.get(`class/offered-section?search=offered_class_id=${val.value.id}`).subscribe((response) => {
      this.offerdSectionDropdown = response.data.data;
      console.log("session_id",this.session_id);
    });
  }
  getDataFromOfferdSection(val:any){
    console.log(this.class_id);
    this.class_shift_id = val.value.class_shift_id;
    this.section_id=val.value.section.id;
  }
  getAttendanceData() {
    let val = this.query_params.start_date;

    val = formatDate(val, 'yyyy-MM-dd', 'en');
    let val2 = this.query_params.end_date;

    val2 = formatDate(val2, 'yyyy-MM-dd', 'en');
    this.query_params.start_date = val;
    let param = {
      class_id:this.class_id,
      section_id:this.section_id,
      // class_shift_id:this.class_shift_id,
      start_date:val,
      end_date:val2
    }
    console.log('this.query_params.start_date',val);
    let tempSearch: any = {
      category_id: this.searchParam.value.category_id,
    };
    this.api
    .getByParams(`class/student-attendance-report`,param)
    .subscribe((response: any) => {
      this.studentdata = response.data;
      this.firstElement = this.studentdata[0];
      this.secondElement = this.studentdata[1]
    });

  }


 }
