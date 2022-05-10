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
  selector: 'app-section-change-form',
  templateUrl: './section-change-form.component.html',
  styleUrls: ['./section-change-form.component.scss']
})
export class SectionChangeFormComponent implements OnInit {
 config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  formItemsData: FormGroup;

  loaderStatus: boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'roll', 'session','section', 'actions'];
  class_id: any = '';
  size = 10;
  page = 1;
  searchString = '';
  enrollment_process='';
  sessionDropdown:any;
  groupDropdown:any;
  shiftDropdown:any;
  paginateStartNo = 0;
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
    public dialogRef: MatDialogRef<SectionChangeFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formItemsData = this.formBuild.group({
      // class_id: ['', checkRequired('Class')],
    });
  }

  ngOnInit(): void {
  
    this.sessionDropdown = this.data.dropdowns.session;
    this.sectionDropdown = this.data.dropdowns.section;

    this.groupDropdown = this.data.dropdowns.group;
    this.shiftDropdown = this.data.dropdowns.shift;
    this.getDataFromApi();
   
    this.api
      .get(`settings/class?&page=1&size=-1`)
      .subscribe((response) => {
        this.classDropdown = response.data.data;
      });

    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
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
    this.dataSource = new MatTableDataSource(this.data.enrollStudentData);
    this.total = this.data.enrollStudentData.length;
   
  }
  classWiseSection(data:any){
    console.log("data",data);
    let dummydata = [
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
  return dummydata;
  }
  actionForDelete(data: any) {
    let array: any[] = this.dataSource.data;
    array.splice(data, 1);
    console.log(array);
    this.dataSource = new MatTableDataSource(array);
    this.total = array.length;
  }
  validateForm(data: any) {
    console.log(data);
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {

      let prevArr: any[] = this.dataSource.data;
      console.log()
      let newArr: any[] = [];
        newArr = prevArr.map(
          ({ id, section_id, class_id, class_roll, group_id,class_shift_id,session_id }) => {

            return {
              id: id,
              shift_id: class_shift_id,
              session_id:session_id,
              class_id: class_id,
              class_roll: class_roll,
              section_id: section_id,
              
              group_id: group_id,
            };
          }
        );
      if (data == 'Transfer') {
        this.enrollment_process = 'Transfer';
      
      }
     
     
      let studentEnrollData = {
        value: {
          enrollment_process:this.enrollment_process,
          students: newArr,
        },
      };
      this.onSubmitEvent.emit(studentEnrollData);
    }
  }

  resetAction() {
    if (this.data.data) {
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });
  }
}
