import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-govern-details',
  templateUrl: './welcome-govern-details.component.html',
  styleUrls: ['./welcome-govern-details.component.scss']
})
export class WelcomeGovernDetailsComponent implements OnInit {

  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
    
  style: any = {
    width: '200px',
    height: '140px'
  }

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WelcomeGovernDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit(): void {
  }

}
