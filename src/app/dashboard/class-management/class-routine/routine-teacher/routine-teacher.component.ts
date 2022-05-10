import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SessionDataPassService } from 'src/app/service/session-data-pass/session-data-pass.service';
import { RoutineFormComponent } from '../routine-form/routine-form.component';

@Component({
  selector: 'app-routine-teacher',
  templateUrl: './routine-teacher.component.html',
  styleUrls: ['./routine-teacher.component.scss'],
})
export class RoutineTeacherComponent implements OnInit {
  @Input() dropdowns: any;
  searchParam: FormGroup;

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private api: ApiService,
    private formBuild: FormBuilder,
    private sassData: SessionDataPassService,
  ) {
    this.searchParam = formBuild.group({
      institute_id: [null],
      view: ['Teacher', checkRequired('View')],
      teacher_id: [null, checkRequired('Teacher')],
      session_id: [null, checkRequired('Session')],
    });
    this.sassData.getSession.subscribe((sass: number) => {
      this.searchParam.controls['session_id'].setValue(sass);
      // this.getTableData();
    })
  }

  viewDropdown: string[] = ['Student', 'Teacher'];
  subjectDropdown: any[] = [];
  teacherDropdown: any[] = [];
  instituteDropdown: any[] = [];
  sessionDropdown: any[] = [];

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
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes.dropdowns.currentValue){
      this.instituteDropdown = this.dropdowns?.institute;
      this.subjectDropdown = this.dropdowns?.subject;
      this.teacherDropdown = this.dropdowns?.teacher;
      this.sessionDropdown = this.dropdowns?.session;
    }
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
          this.insertIntoTable(response?.data);
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
    response_data[`teacher_${key}_period`].forEach(
      (resp_period: any[], index: number) => {
        let prev_order: number = response_data[`teacher_${key}_period`][
          index - 1
        ]?.order_no
          ? response_data[`teacher_${key}_period`][index - 1]?.order_no + 1
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
        title: 'Break',
        table_type: 'data',
      });
      this.pushIntoPeriod(t_array.length);
    }
    t_array.push({
      ...period,
      day: day_name,
      title: `${period?.subject?.title}`,
      table_type: 'data',
    });
    this.pushIntoPeriod(t_array.length);
  }

  pushIntoPeriod(currentLength: number) {
    if (this.tableDatas[0].length < currentLength) {
      this.tableDatas[0].push({
        title: `Period ${currentLength - 1}`,
        table_type: 'header',
      });
    }
  }

  actionForEdit() {}

  editData() {}

  actionForDelete() {}

  deleteData() {}
}
