import { Injectable } from '@angular/core';
import { LOCATIONS } from './constants/locations';

@Injectable()
export class LocationService {

  locations: string[] = [];

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
