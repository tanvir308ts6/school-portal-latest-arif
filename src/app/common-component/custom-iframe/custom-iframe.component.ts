import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-custom-iframe',
  templateUrl: './custom-iframe.component.html',
  styleUrls: ['./custom-iframe.component.scss']
})
export class CustomIframeComponent implements OnInit {

  @Input() url_id: any;
  @Input() cus_style: any;
  @Input() cus_id: number = 0;
  @Input() cus_div_style: any;
  @Input() cus_div_class: string[] = [];
  @Input() cus_img_class: string[] = [];
  
  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes?.url_id?.currentValue){
      window.setTimeout(() => {
        this.fileSrcGetter();
      }, 200);
    }else{
      window.setTimeout(() => {
        this.setNoImageFile();
      }, 200);
    }
    this.cus_div_class.join(' ');
    this.cus_img_class.join(' ');
  }

  async fileSrcGetter(){
    let tempD: any = document.getElementById(this.cus_id ? `custom-iframe-container${this.cus_id}` : 'custom-iframe-container');
    tempD.innerHTML = '';
    let fileUrl = await this.api.fileGet(`public-portal/content/${this.url_id}`);
    let tempI: any = document.createElement('iframe');
    tempI.src = fileUrl;
    tempI.className = this.cus_img_class;
    if(this.cus_style){
      Object.entries(this.cus_style).forEach(([key, value]) => {
        tempI.style[key] = value;
      });
    }
    if(this.cus_div_style){
      Object.entries(this.cus_div_style).forEach(([key, value]) => {
        tempD.style[key] = value;
      });
    }
    tempD.appendChild(tempI);
  }

  async setNoImageFile(){
    let tempD: any = document.getElementById(this.cus_id ? `custom-iframe-container${this.cus_id}` : 'custom-iframe-container');
    tempD.innerHTML = '';
    let tempI: any = document.createElement('img');
    tempI.src = '../../../assets/files/no-image-available.jpg';
    tempI.className = this.cus_img_class;
    if(this.cus_style){
      Object.entries(this.cus_style).forEach(([key, value]) => {
        tempI.style[key] = value;
      });
    }
    if(this.cus_div_style){
      Object.entries(this.cus_div_style).forEach(([key, value]) => {
        tempD.style[key] = value;
      });
    }
    tempD.appendChild(tempI);
  }

}
