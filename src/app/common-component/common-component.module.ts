import { NgModule } from '@angular/core';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { TextSearchDropdownComponent } from './text-search-dropdown/text-search-dropdown.component';
import { SnackberMessageComponent } from './snackber-message/snackber-message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DetailsComponent } from './details/details.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatModule } from '../mat/mat.module';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PipeModule } from '../pipes/pipe/pipe.module';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CustomImageComponent } from './custom-image/custom-image.component';
import { CustomIframeComponent } from './custom-iframe/custom-iframe.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageModifierComponent } from './image-modifier/image-modifier.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    ViewDetailsComponent,
    TextSearchDropdownComponent,
    SnackberMessageComponent,
    NotFoundComponent,
    DetailsComponent,
    ConfirmationDialogComponent,
    CustomTableComponent,
    AutocompleteComponent,
    CustomImageComponent,
    CustomIframeComponent,
    ImageModifierComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    LayoutModule,
    PipeModule,
    DragDropModule,
    ImageCropperModule,
  ],
  exports: [
    ViewDetailsComponent,
    TextSearchDropdownComponent,
    SnackberMessageComponent,
    NotFoundComponent,
    DetailsComponent,
    ConfirmationDialogComponent,
    CustomTableComponent,
    AutocompleteComponent,
    CustomImageComponent,
    CustomIframeComponent,
  ],
})
export class CommonComponentModule {}
