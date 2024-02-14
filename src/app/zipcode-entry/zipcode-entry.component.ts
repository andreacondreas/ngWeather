import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent implements OnInit {
  @Output() zipcode = new EventEmitter<string>();
  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      zipcode: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  addLocation(entryZipcode: string) {
    if (!entryZipcode)
      return;
    this.zipcode.emit(entryZipcode);
    this.form.reset();
  }

}
