import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
// import {df} from '../../../assets/files/'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  insertData: any = {};
  baseUrl: string = '';
  others: any[] = [];
  subs: any[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    if (
      data?.image.endsWith('jpg') ||
      data?.image.endsWith('jpeg') ||
      data?.image.endsWith('png') ||
      data?.image.endsWith('gif')
    ) {
    } else {
      data.static_image = `../../../${environment.asset_prefix}assets/files/Frame_1.png`;
    }
    this.insertData = { ...this.data };
    this.baseUrl = environment.base_url;
    if (this.data.table) {
      for (let [key, value] of Object.entries(this.data.table)) {
        if (
          // typeof value != 'object' &&
          // value &&
          // !JSON.stringify(value).includes('undefined') &&
          // !JSON.stringify(value).includes('null')
          true
        ) {
          this.others.push({
            key: key,
            value: value,
          });
        }
      }
    }
  }

  notFoundMessage(data: string){
    return `<p>No ${data} Found</p>`;
  }

  ngOnInit(): void {}

  closeSelf() {
    this.dialogRef.close();
  }

  getStyleRow(data: number): any {
    return {
      display: 'flex',
      'background-color':
        data && data % 2 == 1 ? 'rgba(255,255,255,1)' : 'rgba(40,160,30,.5)',
      'align-items': 'center',
      height: '50px',
    };
  }

  getStyleTab(data: string) {
    if (data == 'column') {
      return {
        display: 'flex',
        'flex-flow': 'column wrap',
        'justify-content': 'space-between',
        padding: '15px',
      };
    } else {
      return {
        display: 'flex',
        'flex-flow': 'row no-wrap',
        'justify-content': 'space-between',
        'align-items': 'center',
        padding: '5px',
      };
    }
  }

  showCloseButton(event: any, act: string) {
    if (act == 'leave') {
      event.target.style.backgroundColor = 'rgba(255,255,255,0)';
    } else {
      event.target.style.backgroundColor = 'rgba(244,67,54,1)';
    }
  }

  goLarge() {
    window.open(`${this.baseUrl}${this.insertData.image}`, '_blank');
  }
}
