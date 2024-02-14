import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  @Output() zipcode = new EventEmitter<string>();
  @Input() conditionsAndZip: ConditionsAndZip[];
  private router = inject(Router);

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation(currentZipcode: string): void {
    this.zipcode.emit(currentZipcode);
  }

  trackByZip(index: number, item: { zip: string; }) {
    return item.zip;
  }
}
