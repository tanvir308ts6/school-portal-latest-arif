import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-custom-image',
  templateUrl: './custom-image.component.html',
  styleUrls: ['./custom-image.component.scss']
})
export class CustomImageComponent implements OnInit {

  @Input() url_id: any;
  @Input() cus_style: any;
  @Input() cus_id: number = 0;
  @Input() cus_class: string[] = [];
  @Input() cus_div_class: string[] = [];
  @Input() img_id: string = '';

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes?.url_id?.currentValue){
      window.setTimeout(() => {
        this.imageSrcGetter();
      }, 200);
    }else{
      window.setTimeout(() => {
        this.setNoImageFile();
      }, 200)
    }
  }

  async imageSrcGetter(){
    let fileUrl = await this.api.fileGet(`content/${this.url_id}`);
    let tempD: any = document.getElementById(this.cus_id ? `custom-image-container${this.cus_id}` : 'custom-image-container');
    let tempI: any = document.createElement('img');
    tempI.src = fileUrl;
    tempI.className = this.cus_class ? this.cus_class.join(' ') : '';
    tempD.className = this.cus_div_class ? this.cus_div_class.join(' ') : '';
    tempI.id = `${this.img_id}-${this.cus_id}`;
    if(this.cus_style){
      Object.entries(this.cus_style).forEach(([key, value]) => {
        tempI.style[key] = value;
      });
    }
    tempD.appendChild(tempI);
  }

  async setNoImageFile(){
    let tempD: any = document.getElementById(this.cus_id ? `custom-image-container${this.cus_id}` : 'custom-image-container');
    let tempI: any = document.createElement('img');
    tempI.src = `../../../${environment.asset_prefix}assets/files/no-image-available.jpg`;
    tempI.className = this.cus_class ? this.cus_class.join(' ') : '';
    tempD.className = this.cus_div_class ? this.cus_div_class.join(' ') : '';
    tempI.id = `${this.img_id}-${this.cus_id}`;
    if(this.cus_style){
      Object.entries(this.cus_style).forEach(([key, value]) => {
        tempI.style[key] = value;
      });
    }
    tempD.appendChild(tempI);
  }

}
