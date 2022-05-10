import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarReuseComponent } from './sidebar/sidebar-reuse/sidebar-reuse.component';
import { MatModule } from '../mat/mat.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidebarReuseComponent
  ],
  imports: [
    CommonModule,
    MatModule,
  ],
  providers:[
    // {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-001'},
    {provide: MAT_DATE_LOCALE, useValue: 'en-001'},
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidebarReuseComponent
  ]
})
export class LayoutModule { }
