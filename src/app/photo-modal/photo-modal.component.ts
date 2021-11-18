import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Photo } from '../services/photo';
import { SpinnerService } from '../services/spinner.service';

export interface DialogData {
  currentAuthorPhotos: Photo[];
  currentPhoto: Photo;
  
}

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css']
})
export class PhotoModalComponent implements OnInit {
  // list of all current author photos
  currentAuthorPhotos: Photo[] = [];

  // list of current photos to display
  currentPhoto: Photo;

  // how many photos to display per page with the index
  pageIndex = 0;
  pageEvent: PageEvent;

  constructor(
    public spinnerService: SpinnerService,
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) {
      this.currentAuthorPhotos = data.currentAuthorPhotos;
      this.currentPhoto = data.currentPhoto;
      this.pageIndex = this.currentAuthorPhotos.findIndex(photo => this.currentPhoto == photo);

    }

  ngOnInit(): void { }

  /**
   * handle page events when paginating through photos.
   * 
   * @param {PageEvent} event the event triggered when clicking next page
   * 
   */
  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPhoto = this.currentAuthorPhotos[this.pageIndex]
  }

}
