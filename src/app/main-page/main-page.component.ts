import { Component, Signal, effect } from '@angular/core';
import { AppConfig } from 'app/app.module';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { LOCATIONS } from 'app/constants/locations';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  icons: string[];
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  constructor(private weatherService: WeatherService, private locationService: LocationService, private appConfig: AppConfig) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    effect(() => {
      // if user add a valid location then add zipcod in localstorage
      const locationsCounter: number = this.currentConditionsByZip().length;
      if (locationsCounter)
        this.locationService.addLocation(this.currentConditionsByZip()[locationsCounter - 1]?.zip);
    });

    for (let loc of this.locationService.locations)
      this.weatherService.addCurrentConditions(loc);
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
