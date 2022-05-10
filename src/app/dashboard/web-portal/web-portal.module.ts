import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { SliderContactAboutComponent } from './slider-contact-about/slider-contact-about.component';
import { SliderFormComponent } from './slider-contact-about/slider-form/slider-form.component';
import { SliderDetailsComponent } from './slider-contact-about/slider-details/slider-details.component';
import { WelcomeGovernComponent } from './welcome-govern/welcome-govern.component';
import { NoticeComponent } from './notice/notice.component';
import { NoticeFormComponent } from './notice/notice-form/notice-form.component';
import { ViewDetailsComponent } from './notice/view-details/view-details.component';
import { EventComponent } from './event/event.component';
import { EventFormComponent } from './event/event-form/event-form.component';
import { ViewEventDetailsComponent } from './event/view-event-details/view-event-details.component';
import { ContactAboutDetailsComponent } from './slider-contact-about/contact-about-details/contact-about-details.component';
import { WelcomeGovernDetailsComponent } from './welcome-govern/welcome-govern-details/welcome-govern-details.component';
import { PortalUserMessagesComponent } from './portal-user-messages/portal-user-messages.component';
import { MessageDetailsComponent } from './portal-user-messages/message-details/message-details.component';

const routes: Routes = [
  {
    path: 'slider-about-contact',
    component: SliderContactAboutComponent,
  },
  {
    path: 'welcome-govern',
    component: WelcomeGovernComponent,
  },
  {
    path: 'notice',
    component: NoticeComponent,
  },
  {
    path: 'event',
    component: EventComponent,
  },
  {
    path: 'portal-user-message',
    component: PortalUserMessagesComponent,
  },
];

@NgModule({
  declarations: [
    SliderContactAboutComponent,
    SliderFormComponent,
    SliderDetailsComponent,
    WelcomeGovernComponent,
    NoticeComponent,
    NoticeFormComponent,
    ViewDetailsComponent,
    EventComponent,
    EventFormComponent,
    ViewEventDetailsComponent,
    ContactAboutDetailsComponent,
    WelcomeGovernDetailsComponent,
    PortalUserMessagesComponent,
    MessageDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ],
})
export class WebPortalModule {}
