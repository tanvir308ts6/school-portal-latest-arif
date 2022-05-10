import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-about-details',
  templateUrl: './contact-about-details.component.html',
  styleUrls: ['./contact-about-details.component.scss']
})
export class ContactAboutDetailsComponent implements OnInit {

  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
    
  style: any = {
    width: '400px',
    height: '200px'
  }

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContactAboutDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
