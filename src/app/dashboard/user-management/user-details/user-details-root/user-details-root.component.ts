import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details-root',
  templateUrl: './user-details-root.component.html',
  styleUrls: ['./user-details-root.component.scss'],
})
export class UserDetailsRootComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;

  headerData: any;
  basicData: any;
  currentTab: number = 0;

  root_url: string = '';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserDetailsRootComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
    this.headerData = data.rootData;
    this.basicData = data.basicTable;
  }

  ngOnInit(): void {
    this.root_url = this.router.url.split('/')[3];
  }

  setCurrentTab({index}: MatTabChangeEvent){
    this.currentTab = index;
  }
}
