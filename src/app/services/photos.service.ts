import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Photo } from './photo'; 
import { Observable, of } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from "../services/message.service";

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private photosUrl: string = "https://picsum.photos/list"; 

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { 
  }
  
  /**
   * Fetch all photos from picsum endpoint.
   * 
   */
  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.photosUrl)
      .pipe(
        tap(_ => this.log('fetched photos')),
        catchError(this.handleError<Photo[]>('getPhotos', []))
      );
  }

  /**
   * sends the log message to the message service
   * 
   * @param {T} message the message
   */
  private log(message: string) {
    this.messageService.add(`PhotoService: ${message}`);
  }

  /**
   * Handle Http operation that failed. Let the app continue.
   * For now this is only printing logs but can do complex
   * error handling here.
   * 
   * @param {T} operation the operation that failed.
   * @param {T} result - the value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // keep app running by returning an empty result
      return of(result as T);
    };
  }

}
