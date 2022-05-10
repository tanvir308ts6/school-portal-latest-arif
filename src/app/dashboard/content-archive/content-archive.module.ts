import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagementComponent } from './content-management/content-management.component';
import { ContentCategoryComponent } from './content-management/content-category/content-category.component';
import { ContentTopicComponent } from './content-management/content-topic/content-topic.component';
import { ContentArchiveComponent } from './content-management/content-archive/content-archive.component';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { ContentCategoryFormComponent } from './content-management/content-category/content-category-form/content-category-form.component';
import { ContentTopicFormComponent } from './content-management/content-topic/content-topic-form/content-topic-form.component';
import { ContentArchiveFormComponent } from './content-management/content-archive/content-archive-form/content-archive-form.component';
import { ContentArchiveDetailsComponent } from './content-management/content-archive/content-archive-details/content-archive-details.component';

const routes: Routes = [
  {
    path: 'content',
    component: ContentManagementComponent,
  },
];

@NgModule({
  declarations: [
    ContentManagementComponent,
    ContentCategoryComponent,
    ContentTopicComponent,
    ContentArchiveComponent,
    ContentCategoryFormComponent,
    ContentTopicFormComponent,
    ContentArchiveFormComponent,
    ContentArchiveDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ],
})
export class ContentArchiveModule {}
