import { Component, OnInit } from '@angular/core';
import { PhotosService } from "../services/photos.service";
import { Photo } from '../services/photo';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SpinnerService } from '../services/spinner.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';

// tile grid to display photos
export interface Tile {
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {

  // form control for author search
  authorFormControl = new FormControl();

  // the filtered authors
  filteredAuthors: Observable<string[]>;

  // spinner to indicate awaiting on response
  showSpinner: boolean;

  // selected author to display. Default to Alejandro Escamilla 
  selectedAuthor: string = "Alejandro Escamilla";

  // list of all photos retrieved from API
  photos: Photo[] = [];

  // list of current photos to display
  currentPhotos: Photo[] = [];

  // list of all authors
  authors: string[] = [];

  // list of all current author photos
  currentAuthorPhotos: Photo[] = [];

  // sizes for tiles 
  sm: number = 1;
  md: number = 2;
  lg: number = 6;

  // how many photos to display per page with the index
  pageSize: number = 10;
  pageIndex: number = 0;

  // flag to display of no selected author
  isEmptyFlag?: boolean;

  // the styling objecto of the tiles to define the 10 photos to display
  tiles: Tile[] = [
    { cols: this.md, rows: this.md },
    { cols: this.sm, rows: this.sm },
    { cols: this.sm, rows: this.sm },
    { cols: this.md, rows: this.sm },
    { cols: this.md, rows: this.md },
    { cols: this.sm, rows: this.sm },
    { cols: this.sm, rows: this.sm },
    { cols: this.md, rows: this.sm },
    { cols: this.sm, rows: this.sm },
    { cols: this.sm, rows: this.sm }];

  constructor(
    private photosService: PhotosService,
    private breakpointObserver: BreakpointObserver,
    public spinnerService: SpinnerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    // get list of all photos
    this.getPhotos();
    // change the state of the tiles when screen size changes
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.tiles = [
            { cols: this.lg, rows: this.md },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.md },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm },
            { cols: this.lg, rows: this.sm }];
        } else {
          this.tiles = [
            { cols: this.md, rows: this.md },
            { cols: this.sm, rows: this.sm },
            { cols: this.sm, rows: this.sm },
            { cols: this.md, rows: this.sm },
            { cols: this.md, rows: this.md },
            { cols: this.sm, rows: this.sm },
            { cols: this.sm, rows: this.sm },
            { cols: this.md, rows: this.sm },
            { cols: this.sm, rows: this.sm },
            { cols: this.sm, rows: this.sm }];
        }
      });
    // the filtered authors for the autocomplete form
    this.filteredAuthors = this.authorFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  /**
   * open the selected photo modal.
   * 
   * @param  {Photo} thePhoto the photo to send to the modal
   */
  openModal(thePhoto: Photo): void {
    const dialogRef = this.dialog.open(PhotoModalComponent, {
      data: { currentAuthorPhotos: this.currentAuthorPhotos, currentPhoto: thePhoto },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  /**
   * get list of all photos from photoService.
   * 
   */
  getPhotos(): void {
    this.photosService.getPhotos().subscribe(
      photoResponse => {
        this.photos = photoResponse;
        this.authors = this.getAuthors(this.photos);
        // filter the user after setting current photos
        this.authorFormControl.setValue(this.selectedAuthor)
      }
    );
  }

  /**
   * get list of all unique authors.
   * 
   * @param {Photo[]} photos the list of all photos
   * 
   */
  getAuthors(photos: Photo[]): string[] {
    const unique = [...new Set(photos.map(item => item.author))];
    return unique;
  }

  /**
   * filter the input from list of all authors.
   * 
   * @param {string} value the value/author of the string
   * 
   */
  private _filter(value: string): string[] {
    if (value == "") {
      this.isEmptyFlag = false;
    } else {
      // Filter the list of photos for the value/author
      this.isEmptyFlag = true;
      this.selectedAuthor = value;
      this.currentAuthorPhotos = this.photos.filter(photo => photo.author == value);
      this.currentPhotos = this.currentAuthorPhotos.slice(0, 10);
    }
    // search the list of arrays to see if the value matches and authors name
    const filterValue = value.toLowerCase();
    return this.authors.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * handle page events when paginating through photos.
   * 
   * @param {PageEvent} event the event triggered when clicking next page
   * 
   */
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.currentPhotos = this.currentAuthorPhotos.slice((this.pageIndex) * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}