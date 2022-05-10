import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-modifier',
  templateUrl: './image-modifier.component.html',
  styleUrls: ['./image-modifier.component.scss'],
})
export class ImageModifierComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  onImageCrop = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageModifierComponent>
  ) {}

  ngOnInit(): void {}

  imageChangedEvent: any = '';
  croppedImage: any = '';
  image_name: string = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.image_name = event.target.files[0].name;
    console.log(event.target.files[0].name);
    
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image?: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  sendImageFile() {
    fetch(this.croppedImage)
      .then((res) => res.blob())
      .then((blob) => this.onImageCrop.emit(new File([blob], this.image_name)));
    // this.onImageCrop.emit(this.croppedImage);
    this.dialogRef.close();
  }
}
