import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { data } from 'jquery';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { RoutineFormComponent } from '../routine-form/routine-form.component';

@Component({
  selector: 'app-routine-student',
  templateUrl: './routine-student.component.html',
  styleUrls: ['./routine-student.component.scss'],
})
export class RoutineStudentComponent implements OnInit {
  searchParam: FormGroup;
  dataIsAvailable: boolean | null = null;
  editable_data: any;

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private api: ApiService,
    private formBuild: FormBuilder
  ) {
    this.searchParam = formBuild.group({
      institute_id: [null],
      view: ['Student', checkRequired('View')],
      class_id: [null, checkRequired('Class')],
      class_shift_id: [null, checkRequired('Shift')],
      group_id: [null, checkRequired('Group')],
      section_id: [null, checkRequired('Section')],
      session_id: [null, checkRequired('Session')],
      teacher_id: [null],
    });
  }

  viewDropdown: string[] = ['Student', 'Teacher'];
  classDropdown: any[] = [];
  shiftDropdown: any[] = [];
  groupDropdown: any[] = [];
  sectionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  subjectDropdown: any[] = [];
  teacherDropdown: any[] = [];
  instituteDropdown: any[] = [];

  tableDatas: any[][] = [];

  initializeTableDatas() {
    this.tableDatas = [
      [
        {
          title: '*****',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Saturday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Sunday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Monday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Tuesday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Wednesday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Thursday',
          table_type: 'header',
        },
      ],
      [
        {
          title: 'Friday',
          table_type: 'header',
        },
      ],
    ];
  }

  ngOnInit(): void {
    this.initializeTableDatas();
    this.getInstituteDropdown();
    this.getClassDropdown();
    this.getGroupDropdown();
    this.getSectionDropdown();
    this.getSessionDropdown();
    this.getShiftDropdown();
    this.getSubjectDropdown();
    this.getTeacherDropdown();
  }

  getInstituteDropdown() {
    this.api
      .get('settings/institute?page=0&size=-1')
      .subscribe((response: any) => {
        this.instituteDropdown = response?.data?.data;
      });
  }

  getClassDropdown() {
    this.api.get('settings/class?page=0&size=-1').subscribe((response: any) => {
      this.classDropdown = response?.data?.data;
    });
  }

  getShiftDropdown() {
    this.api.get('settings/shift?page=0&size=-1').subscribe((response: any) => {
      this.shiftDropdown = response?.data?.data;
    });
  }

  getGroupDropdown() {
    this.api.get('settings/group?page=0&size=-1').subscribe((response: any) => {
      this.groupDropdown = response?.data?.data;
    });
  }

  getSectionDropdown() {
    this.api
      .get('settings/section?page=0&size=-1')
      .subscribe((response: any) => {
        this.sectionDropdown = response?.data?.data;
      });
  }

  getSessionDropdown() {
    this.api
      .get('settings/session?page=0&size=-1')
      .subscribe((response: any) => {
        this.sessionDropdown = response?.data?.data;
      });
  }

  getSubjectDropdown() {
    this.api
      .get('settings/subject?page=0&size=-1')
      .subscribe((response: any) => {
        this.subjectDropdown = response?.data?.data;
      });
  }

  getTeacherDropdown() {
    let search: any = {
      type: 'Teacher',
    };
    this.api
      .get(
        `user/employee?page=0&size=-1&search=${this.api.getSearchData(search)}`
      )
      .subscribe((response: any) => {
        this.teacherDropdown = response?.data?.data;
      });
  }

  resetForm() {
    this.searchParam.markAsPristine();
    this.searchParam.markAsUntouched();
    Object.keys(this.searchParam.controls).forEach((field) => {
      const control = this.searchParam.get(field);
      control?.setValue('');
    });
  }

  getTableData() {
    Object.keys(this.searchParam.controls).forEach((field) => {
      const control = this.searchParam.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.searchParam.valid) {
      this.initializeTableDatas();
      let searchParameter = { ...this.searchParam.value };
      if (this.searchParam.value.view === 'Student') {
        delete searchParameter.teacher_id;
      }
      this.api
        .getByParams('class/routine', searchParameter)
        .subscribe((response: any) => {
          if (response?.data[0]) {
            this.dataIsAvailable = true;
            this.editable_data = response?.data[0];
            let result = this.combineAllDatas(response?.data[0]);
            this.tableDatas.forEach((day: any[], index: number) => {
              if (index > 0) {
                this.insertDataAccordingToResponse(
                  day[0]?.title,
                  result,
                  index
                );
              }
            });
          }else{
            this.dataIsAvailable = false;
          }
        });
    }
  }

  // a redundent method
  combineAllDatas(data: any): any[] {
    let result: any[] = [];
    let days: string[] = [
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ];
    days.forEach((day: string) => {
      let tempDay: any[] = data[`student_${day.slice(0, 3)}_period`].map(
        (res: any) => {
          return {
            ...res,
            start_time: res?.start_time.slice(0,5),
            end_time: res?.end_time.slice(0,5),
            day: `${day.charAt(0).toUpperCase()}${day.slice(1)}`,
            title: `${res?.subject?.title}`,
            table_type: 'data',
            subtitle: `${res?.teacher?.name}`,
          };
        }
      );
      result = result.concat(tempDay);
    });
    return result;
  }

  insertDataAccordingToResponse(
    day_name: any,
    all_periods: any[],
    parentIndex: number
  ) {
    let tempPeriod: any = all_periods?.find(
      (period: any) =>
        period?.day == day_name &&
        period?.order_no == this.tableDatas[parentIndex]?.length
    );
    if (tempPeriod) {
      this.tableDatas[parentIndex].push(tempPeriod);
      this.pushIntoPeriod(this.tableDatas[parentIndex].length);
      this.insertDataAccordingToResponse(day_name, all_periods, parentIndex);
    }
  }

  pushIntoPeriod(currentLength: number) {
    if (this.tableDatas[0].length < currentLength) {
      this.tableDatas[0].push({
        title: `Period ${currentLength - 1}`,
        table_type: 'header',
      });
    }
  }

  actionForModifyTable(p_index: number, opt_c_index?: number) {
    let c_index: number = opt_c_index ?? this.tableDatas[p_index].length;
    const dialogRef = this.dialog.open(RoutineFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          subject: this.subjectDropdown,
          teacher: this.teacherDropdown,
        },
        preData: {
          day: this.tableDatas[p_index][0]?.title,
          start_time: this.tableDatas[p_index][c_index - 1]?.end_time,
          order_no: c_index,
        },
        data: opt_c_index ? this.tableDatas[p_index][c_index] : null,
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result) {
        this.loaderService.setLoaderStatus(true);
        if (opt_c_index) {
          this.modifyTable(result.value, dialogRef, p_index, c_index);
        } else {
          this.modifyTable(result.value, dialogRef, p_index);
        }
      }
    });
  }

  modifyTable(data: any, dialog: any, row_pos: number, col_pos?: number) {
    if (col_pos) {
      this.tableDatas[row_pos].splice(col_pos, 1, {
        ...data,
        title: data?.subject?.title,
        table_type: 'data',
      });
    } else {
      this.tableDatas[row_pos].push({ ...data, title: data?.subject?.title, table_type: 'data', });
    }
    this.pushIntoPeriod(this.tableDatas[row_pos].length);
    dialog.close();
  }

  actionForDeletePeriod(row_pos: number, col_pos: number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to delete period?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if(result?.status == 1){
        this.deletePeriod(dialogRef, row_pos, col_pos);
      }else{
      }
    })
  }

  deletePeriod(dialog: any, row: number, col: number){
    this.tableDatas[row].splice(col, 1);
  }

  actionForApiSend() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to modify routine?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.callApi(dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  callApi(dialog: any) {
    let periods: any[] = [];
    this.tableDatas.forEach((row: any[], index: number) => {
      if (index > 0) {
        let tempRow = row.slice(1);
        periods = periods.concat(tempRow);
      }
    });
    let form_data: any = { ...this.searchParam.value };
    if (form_data.view === 'Student') {
      delete form_data.teacher_id;
    }
    if(this.dataIsAvailable !== null){
      if(this.dataIsAvailable){
        this.editData(dialog, form_data, periods);
      }else{
        this.addData(dialog, form_data, periods);
      }
    }
  }

  addData(dialog: any, form_data: any, periods: any[]){
    this.api
      .post('class/routine', { ...form_data, routine_periods: periods })
      .subscribe(
        (response: any) => {
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(true);
          dialog.close();
        },
        (error: any) => {
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(false);
          dialog.close();
        }
      );
  }

  editData(dialog: any, form_data: any, periods: any[]) {
    this.api
      .update(`class/routine/${this.editable_data?.id}`, { ...form_data, routine_periods: periods })
      .subscribe(
        (response: any) => {
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(true);
          dialog.close();
        },
        (error: any) => {
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(false);
          dialog.close();
        }
      );
  }
}
