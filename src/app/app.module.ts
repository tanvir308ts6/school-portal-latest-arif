import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonComponentModule } from './common-component/common-component.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatModule } from './mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PipeModule } from './pipes/pipe/pipe.module';
import { ValidationDirective } from './directives/validation/validation.directive';


@NgModule({
  declarations: [AppComponent, ValidationDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    NgbModule,
    MatModule,
    CKEditorModule,
    CdkTableModule,
    DragDropModule,
    PipeModule,
    CommonComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
