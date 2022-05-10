import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-subject-material-details',
  templateUrl: './subject-material-details.component.html',
  styleUrls: ['./subject-material-details.component.scss']
})
export class SubjectMaterialDetailsComponent implements OnInit {
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
    public dialogRef: MatDialogRef<SubjectMaterialDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
