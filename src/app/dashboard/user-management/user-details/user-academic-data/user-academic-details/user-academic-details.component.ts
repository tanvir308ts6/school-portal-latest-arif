import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-academic-details',
  templateUrl: './user-academic-details.component.html',
  styleUrls: ['./user-academic-details.component.scss']
})
export class UserAcademicDetailsComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  table_data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.table_data = Object.entries(data?.tableData);
  }

  ngOnInit(): void {
  }

}
