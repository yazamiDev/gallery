import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  // indicator whether the spinner animation is loading
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }
}