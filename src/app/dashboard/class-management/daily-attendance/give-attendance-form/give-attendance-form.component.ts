import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-give-attendance-form',
  templateUrl: './give-attendance-form.component.html',
  styleUrls: ['./give-attendance-form.component.scss']
})
export class GiveAttendanceFormComponent implements OnInit {
 config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  
  searchParam: FormGroup;
  loaderStatus: boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
  'checkbox',
  'id',
  'name',
  'roll',
  'section',
  'class',

  
  ];
  class_id: any = '';
  size = 10;
  page = 1;
  parentCheck:Boolean = true;
  searchString = '';
  enrollment_process='';
  sessionDropdown:any;
  groupDropdown:any;
  shiftDropdown:any;
  paginateStartNo = 0;
  title:any;
  total: any = null;
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
  editor = ClassicEditor;
  promotionStat:any;
  btnForPromotOrNot:any;
  onSubmitEvent = new EventEmitter();
  sectionDropdown: any[] = [];
  classDropdown: any[] = [];
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

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<GiveAttendanceFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.searchParam = this.formBuild.group({
      name: [''],
      class_roll: [''],
      class_id: [],
      section_id: [],
    });
  }

  ngOnInit(): void {
  
    this.getDataFromApi();
    
  }
  changePagination(event: any) {
    let pageData = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
    };
    this.storage.setFilterData(pageData);
    this.getDataFromApi();
  }
  getDataFromApi() {
    this.loaderStatus = true;
    let val = this.data.date;
    this.searchString = this.api.getSearchData(this.data.search);
    this.storage.setFilterData({
      search: this.searchString ? this.searchString : 'clear',
    });
    let searchData = this.api.getFilterData(
      { pagination: true, search: true,date:val },
      true
      );

    this.api
    .get('class/un-attend-student' + searchData['searchData'])
    .subscribe((response) => {
      this.dataSource = new MatTableDataSource(response?.data?.data);

      this.total = response.data.total;
      this.loaderStatus = false;
      
    }, (error: any) => {
      this.dataSource = new MatTableDataSource();
      this.total = null;
      this.loaderStatus = false;
    });
  }
  // getSectionBySessionAndClass(data?:any){
  //   console.log(data.value);
  //    this.api
  //     .getWithoutPagination('settings/section',{session_id:data.value,class_id:this.formItemsData.value.class_id},)
  //     .subscribe((response) => {
  //       this.sectionDropdown = response?.data?.data;
  //     });
  // }
  actionForDelete(data: any) {
    let array: any[] = this.dataSource.data;
    array.splice(data, 1);
    console.log(array);
    this.dataSource = new MatTableDataSource(array);
    this.total = array.length;
  }

  validateForm(data?: any) {
    const datas: any[] = this.dataSource.data;

    const result = datas.filter((data) => data.check == true);

    console.log(result);
    let users = result.map(({user_id})=>{
       return {
         id:user_id
       };
    })

  
      this.onSubmitEvent.emit(users);
   
  }

  // resetAction() {
  //   if (this.data.data) {
  //   } else {
  //     this.resetForm();
  //   }
  // }

  // resetForm() {
  //   this.formItemsData.markAsPristine();
  //   this.formItemsData.markAsUntouched();
  //   Object.keys(this.formItemsData.controls).forEach((field) => {
  //     const control = this.formItemsData.get(field);
  //     control?.setValue('');
  //   });
  // }
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
}
