import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() displayName: any;
  @Input() mouseIsOver: any;
  @Input() menuContentToggle: any;

  @Output() navBarOpenEvent = new EventEmitter<any>();
  @Output() navPosition = new EventEmitter<any>();

  searchVisibility = false;
  instituteData: any;
  userInfo: any;
  userTokenData: any;
  currentToggle: boolean = true;
  currentUser: any = {
    name: 'Login',
    profile_image: 'account_3.png'
  };
  imgUrl: string = `../../../../${environment.asset_prefix}assets/images/`;

  constructor(
    public api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let data: any = window.localStorage.getItem('currentUser');
    if(data){
      data = JSON.parse(data);
      this.currentUser = {...data};
      this.currentUser.profile_image = 'account_3.png';
    }
    this.api.getFileData(`${data.profile_image}`).subscribe((response) => {
      if(response && response.response.code != 404){
        this.imgUrl = environment.base_url;
        this.currentUser.profile_image = data.profile_image;
      }
    });
  }


  toggleOpened(): void {
    this.navBarOpenEvent.emit({opened: true});
    this.currentToggle = !this.currentToggle;
  }

  toggleNavPosition(): void {
    this.navPosition.emit({toggleNav: true});
  }

  goToInstitute(){
    if(this.displayName.name && this.displayName.name != 'ERP'){
      // window.open(`${environment.view_url}admin/institute-new`);
    }
  }

  openSearch(): void {
    this.searchVisibility = true;
  }

  closeSearch(): void {
    this.searchVisibility = false;
  }

  logoutMethod(){
    this.api.post('logout', {}).subscribe( response => {
      window.localStorage.removeItem('dgmeToken');
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, error => {

    })
  }

}
