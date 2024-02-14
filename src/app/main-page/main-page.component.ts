import { Component, Signal, effect } from '@angular/core';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { LOCATIONS } from 'app/constants/locations';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  constructor(private weatherService: WeatherService, private locationService: LocationService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    this.weatherService.initStoredConditions(this.locationService.locations);
    // for (let loc of this.locationService.locations)
    //   this.weatherService.addCurrentConditions(loc);
    effect(() => {
      // if user add a valid location then add zipcode in localstorage
      const locationsCounter: number = this.currentConditionsByZip().length;
      const zipcode = this.currentConditionsByZip()[locationsCounter - 1]?.zip;
      const index = this.locationService.locations.indexOf(zipcode);
      // if user add a zipcode not just included in locationService.locations
      if (zipcode && index === -1)
        this.locationService.addLocation(zipcode);
    });
  }

  addLocation(zipcode: string): void {
    let index = this.locationService.locations.indexOf(zipcode);
    if (index === -1)
      this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
  }
}
