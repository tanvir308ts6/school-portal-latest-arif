import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoaderService } from 'src/app/service/loader/loader.service';

export interface DialogData {
  animal: string;
  name: string;
  title:string;
  leftBtn:string;
  rightBtn:string;
  leftBtnIcon:string;
  rightBtnIcon:string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      
    }

  ngOnInit() {
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
  }

  onYesClick(): void {
    this.onSubmitEvent.emit({status:1});
  }

  closeModal(): void {
    this.onSubmitEvent.emit({status:0});
  }

  endProcess(): void{
    this.dialogRef.close();
  }

}