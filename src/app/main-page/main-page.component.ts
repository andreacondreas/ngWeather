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
    for (let loc of this.locationService.locations)
      this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipcode: string): void {
    let index = this.locationService.locations.indexOf(zipcode);
    if (index === -1) {
      this.locationService.addLocation(zipcode);
      this.weatherService.addCurrentConditions(zipcode);
    }
  }

  removeLocation(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
  }
}
