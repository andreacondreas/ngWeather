import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  @Output() zipcode = new EventEmitter<string>();
  constructor() { }

  addLocation(entryZipcode: string) {
    if (!entryZipcode)
      return;
    this.zipcode.emit(entryZipcode);
  }

}
