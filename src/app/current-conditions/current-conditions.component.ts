import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  @Output() closedZipcode = new EventEmitter<string>();
  @Output() selectedCurrentCondition = new EventEmitter<number>();
  @Input() conditionsAndZip: ConditionsAndZip[];
  private router = inject(Router);

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation(currentZipcode: string): void {
    this.closedZipcode.emit(currentZipcode);
  }

  trackByZip(index: number, item: { zip: string; }) {
    return item.zip;
  }

  getCondition(i: number): void {
    this.selectedCurrentCondition.emit(i);
  }
}
