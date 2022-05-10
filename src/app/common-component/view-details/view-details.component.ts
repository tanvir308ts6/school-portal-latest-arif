import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {
  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  viewDetails: any = {};

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    
    this.viewDetails=this.data.data;
  }

  ngOnInit(): void {
  }

  closeSelf(){
    this.dialogRef.close();
  }

}
