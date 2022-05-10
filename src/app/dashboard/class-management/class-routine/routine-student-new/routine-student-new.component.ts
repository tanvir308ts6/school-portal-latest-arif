import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { RoutineFormComponent } from '../routine-form/routine-form.component';
import { TimeslotFormComponent } from '../timeslot-form/timeslot-form.component';

@Component({
  selector: 'app-routine-student-new',
  templateUrl: './routine-student-new.component.html',
  styleUrls: ['./routine-student-new.component.scss'],
})
export class RoutineStudentNewComponent implements OnInit {
  @Input() dropdowns: any;
  searchParam: FormGroup;
  dataIsAvailable: boolean | null = null;
  editable_data: any;
  currentColumnCount: number = 0;

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private api: ApiService,
    private formBuild: FormBuilder,
    private sassData: SessionDataPassService
  ) {
    this.searchParam = formBuild.group({
      institute_id: [null],
      view: ['Student', checkRequired('View')],
      class_id: [null, checkRequired('Class')],
      class_shift_id: [null, checkRequired('Shift')],
      group_id: [null],
      section_id: [null, checkRequired('Section')],
      session_id: [null, checkRequired('Session')],
      teacher_id: [null],
    });
    this.sassData.getSession.subscribe((sass: number) => {
      this.searchParam.controls['session_id'].setValue(sass);
      // this.getTableData();
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
    this.getClassDropdown();
    this.getGroupDropdown();
    this.getSectionDropdown();
    this.getShiftDropdown();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dropdowns.currentValue) {
      this.instituteDropdown = this.dropdowns?.institute;
      this.subjectDropdown = this.dropdowns?.subject;
      this.teacherDropdown = this.dropdowns?.teacher;
      this.sessionDropdown = this.dropdowns?.session;
    }
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

  resetForm() {
    this.searchParam.markAsPristine();
    this.searchParam.markAsUntouched();
    Object.keys(this.searchParam.controls).forEach((field) => {
      const control = this.searchParam.get(field);
      control?.setValue('');
    });
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

  getTableData() {
    Object.keys(this.searchParam.controls).forEach((field) => {
      const control = this.searchParam.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.searchParam.valid) {
      this.initializeTableDatas();
      this.currentColumnCount = 0;
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
            this.insertIntoTable(response?.data[0]);
            this.changeAccordingToInput();
          } else {
            this.dataIsAvailable = false;
          }
        });
    }
  }

  insertIntoTable(data: any) {
    this.tableDatas.forEach((tRow: any[], t_r_index: number) => {
      if (t_r_index > 0) {
        this.insertIntoTableRows(tRow[0]?.title, tRow, data);
      }
    });
  }

  insertIntoTableRows(day_name: string, table_row: any[], response_data: any) {
    let key: string = `${day_name.charAt(0).toLowerCase()}${day_name.slice(
      1,
      3
    )}`;
    response_data[`student_${key}_period`].forEach(
      (resp_period: any[], index: number) => {
        let prev_order: number = response_data[`student_${key}_period`][
          index - 1
        ]?.order_no
          ? response_data[`student_${key}_period`][index - 1]?.order_no + 1
          : 1;
        this.insertIntoTableColumn(
          resp_period,
          table_row,
          day_name,
          prev_order
        );
      }
    );
  }

  insertIntoTableColumn(
    period: any,
    t_array: any[],
    day_name: string,
    prev_order: number
  ) {
    for (let i = prev_order; i < Number(period?.order_no); i++) {
      t_array.push({
        day: day_name,
        table_type: 'null',
      });
      this.insertIntoTableHeader(t_array.length);
    }
    t_array.push({
      ...period,
      day: day_name,
      title: period?.subject?.title ? `${period?.subject?.title}` : 'Break',
      subtitle: period?.teacher?.name ? `${period?.teacher?.name}` : '',
      type: (period?.subject_id && period?.teacher_id) ? 'Class' : 'Break',
      table_type: 'data',
    });
    this.insertIntoTableHeader(t_array.length, period);
  }

  insertIntoTableHeader(current_length: number, data?: any) {
    if (this.tableDatas[0].length < current_length) {
      if (data) {
        this.tableDatas[0].push({
          start_time: data?.start_time,
          end_time: data?.end_time,
          duration: this.getDuration(data?.start_time, data?.end_time),
          type: data?.subject_id && data?.teacher_id ? 'Class' : 'Break',
          title: `${data?.start_time?.slice(0, 5)} to ${data?.end_time?.slice(
            0,
            5
          )} (${this.getDuration(data?.start_time, data?.end_time)} minutes)`,
          table_type: 'header',
        });
      } else {
        this.tableDatas[0].push({ table_type: 'header' });
      }
      this.currentColumnCount++;
    } else {
      if (!this.tableDatas[0][current_length - 1]?.type) {
        if (data) {
          this.tableDatas[0].splice(current_length - 1, 1, {
            start_time: data?.start_time,
            end_time: data?.end_time,
            duration: this.getDuration(data?.start_time, data?.end_time),
            type: data?.subject_id && data?.teacher_id ? 'Class' : 'Break',
            title: `${data?.start_time?.slice(0, 5)} to ${data?.end_time?.slice(
              0,
              5
            )} (${this.getDuration(data?.start_time, data?.end_time)} minutes)`,
            table_type: 'header',
          });
        }
      }
    }
  }

  getDuration(start_time: string, end_time: string): number {
    let result: number = 0;
    let start_hour: number = Number(start_time.split(':')[0]);
    let start_minute: number = Number(start_time.split(':')[1]);
    let end_hour: number = Number(end_time.split(':')[0]);
    let end_minute: number = Number(end_time.split(':')[1]);
    result = (end_hour - start_hour) * 60 + (end_minute - start_minute);
    return result;
  }

  changeAccordingToInput() {
    this.tableDatas.forEach((row: any, r_index: number) => {
      if (this.currentColumnCount !== null) {
        let initialI: number = row.length;
        if (row.length < this.currentColumnCount + 1) {
          for (let i = initialI; i <= this.currentColumnCount; i++) {
            row.push(
              r_index !== 0
                ? {
                    table_type: 'null',
                  }
                : {
                    table_type: 'header',
                  }
            );
          }
        } else {
          for (let i = initialI; i > this.currentColumnCount + 1; i--) {
            row.pop();
          }
        }
      }
    });
  }

  columnCountChange() {
    this.currentColumnCount++;
    this.changeAccordingToInput();
  }

  actionForModifyTableHeader(c_index: number) {
    const dialogRef = this.dialog.open(TimeslotFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: this.tableDatas[0][c_index].start_time ? {
          start_time: this.tableDatas[0][c_index].start_time,
          end_time: this.tableDatas[0][c_index].end_time,
          duration: this.tableDatas[0][c_index].duration,
          type: this.tableDatas[0][c_index].type
        } : null,
        preData: {
          start_time: this.tableDatas[0][c_index - 1]?.end_time ?? null,
          order_no: c_index,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result.value) {
        this.modifyTableHeader(c_index, result.value, dialogRef);
      }
    });
  }

  modifyTableHeader(col_pos: number, data: any, dialog: any) {
    let tempData = {
      ...data,
      title: `${data?.start_time} to ${data?.end_time} (${data?.duration} minutes)`,
      table_type: 'header',
    };
    this.tableDatas[0][col_pos] = tempData;
    this.tableDatas.forEach((row: any[], row_index: number) => {
      if(col_pos < row.length){
        if(row[col_pos].table_type === 'data'){
          row[col_pos].start_time = data?.start_time;
          row[col_pos].end_time = data?.end_time;
          row[col_pos].duration = data?.duration;
        }
      }
    })
    dialog.close();
  }

  actionForDeleteTableHeader(c_index: number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to delete timeslot?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result?.status == 1) {
        this.deleteTableHeader(c_index, dialogRef);
      }
    });
  }

  deleteTableHeader(col_pos: number, dialog: any){
    this.tableDatas.forEach((row: any[]) => {
      row.forEach((col: any, cI: number) => {
        if(cI > col_pos){
          if(col?.order_no){
            col.order_no --;
          }
        }
      })
      row.splice(col_pos, 1);
    });
    this.currentColumnCount--;
    dialog.close();
  }

  actionForModifyTableData(p_index: number, opt_c_index?: number) {
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
          start_time: this.tableDatas[0][c_index]?.start_time,
          end_time: this.tableDatas[0][c_index]?.end_time,
          order_no: c_index,
          type: this.tableDatas[0][c_index]?.type,
          duration: this.tableDatas[0][c_index]?.duration,
        },
        data:
          this.tableDatas[p_index][c_index].table_type !== 'null'
            ? this.tableDatas[p_index][c_index]
            : null,
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result) {
        this.loaderService.setLoaderStatus(true);
        if (opt_c_index) {
          this.modifyTableData(result.value, dialogRef, p_index, c_index);
        } else {
          this.modifyTableData(result.value, dialogRef, p_index);
        }
      }
    });
  }

  modifyTableData(data: any, dialog: any, row_pos: number, col_pos?: number) {
    if (col_pos) {
      this.tableDatas[row_pos].splice(col_pos, 1, {
        ...data,
        title: data?.subject?.title ?? 'Break',
        subtitle: data?.teacher?.name ?? '',
        description: `${data?.start_time} to ${
          data?.end_time
        } (${this.getDuration(data?.start_time, data?.end_time)} minutes)`,
        table_type: 'data',
      });
    } else {
      this.tableDatas[row_pos].push({
        ...data,
        title: data?.subject?.title,
        subtitle: `${data?.teacher?.name}`,
        description: `${data?.start_time} to ${
          data?.end_time
        } (${this.getDuration(data?.start_time, data?.end_time)} minutes)`,
        table_type: 'data',
      });
    }
    dialog.close();
  }

  actionForDeletePeriod(row_pos: number, col_pos: number) {
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
      if (result?.status == 1) {
        this.deletePeriod(dialogRef, row_pos, col_pos);
      } else {
      }
    });
  }

  deletePeriod(dialog: any, row: number, col: number) {
    this.tableDatas[row].splice(col, 1, { table_type: 'null' });
    dialog.close();
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
        let tempRow = row
          .slice(1)
          .filter((tada: any) => tada.table_type !== 'null')
          .map((tada: any) => {
            return tada?.id
              ? {
                  id: tada?.id,
                  teacher_id: tada?.teacher_id ?? null,
                  subject_id: tada?.subject_id ?? null,
                  start_time: tada?.start_time?.slice(0, 5),
                  end_time: tada?.end_time?.slice(0, 5),
                  order_no: tada?.order_no,
                  day: tada?.day ?? tada?.day_name,
                }
              : {
                  teacher_id: tada?.teacher_id ?? null,
                  subject_id: tada?.subject_id ?? null,
                  start_time: tada?.start_time?.slice(0, 5),
                  end_time: tada?.end_time?.slice(0, 5),
                  order_no: tada?.order_no,
                  day: tada?.day ?? tada?.day_name,
                };
          });
        periods = periods.concat(tempRow);
      }
    });
    let form_data: any = { ...this.searchParam.value };
    if (form_data.view === 'Student') {
      delete form_data.teacher_id;
    }
    if (this.dataIsAvailable !== null) {
      if (this.dataIsAvailable) {
        this.editData(dialog, form_data, periods);
      } else {
        this.addData(dialog, form_data, periods);
      }
    }
  }

  addData(dialog: any, form_data: any, periods: any[]) {
    this.api
      .post('class/routine', { ...form_data, routine_periods: periods })
      .subscribe(
        (response: any) => {
          this.showBackendMessage(response.response);
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(true);
          dialog.close();
        },
        (error: any) => {
          this.showBackendMessage(error.error.response);
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(false);
          dialog.close();
        }
      );
  }

  editData(dialog: any, form_data: any, periods: any[]) {
    this.api
      .update(`class/routine/${this.editable_data?.id}`, {
        ...form_data,
        routine_periods: periods,
      })
      .subscribe(
        (response: any) => {
          this.showBackendMessage(response.response);
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(true);
          dialog.close();
        },
        (error: any) => {
          this.showBackendMessage(error.error.response);
          this.loaderService.setLoaderStatus(false);
          this.loaderService.setSubmissionStatus(false);
          dialog.close();
        }
      );
  }
}
