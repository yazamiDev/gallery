import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];

  constructor() { }

  /**
   * add messages to the array. In production this
   * would go into a logging system.
   * 
   * @param {string} message the message
   */
  add(message: string): void {
    this.messages.push(message);
  }

}