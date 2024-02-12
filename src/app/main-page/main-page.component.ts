import { Component } from '@angular/core';
import { LOCATIONS } from 'app/constants/locations';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {

  constructor(private weatherService : WeatherService, private locationService: LocationService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    for (let loc of this.locationService.locations)
      this.weatherService.addCurrentConditions(loc);
  }
}
