import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackber-message',
  templateUrl: './snackber-message.component.html',
  styleUrls: ['./snackber-message.component.scss']
})
export class SnackberMessageComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SnackberMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  showData: any[] = [];

  ngOnInit(): void {
    if(typeof this.data.message == 'string'){
      this.showData.push(['null', this.data.message]);
    }else{
      Object.entries(this.data.message).some((res: any)=>{
        let arr = [res[0], res[1][0]];
        this.showData.push(arr);
        return true;
      });
    }
    setTimeout(()=>{
      this.dialogRef.close();
    }, 5000);
  }

  closeAction(){
    this.dialogRef.close();
  }

}
