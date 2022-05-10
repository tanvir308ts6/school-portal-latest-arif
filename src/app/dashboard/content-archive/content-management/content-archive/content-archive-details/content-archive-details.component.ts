import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-content-archive-details',
  templateUrl: './content-archive-details.component.html',
  styleUrls: ['./content-archive-details.component.scss']
})
export class ContentArchiveDetailsComponent implements OnInit {

  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContentArchiveDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
