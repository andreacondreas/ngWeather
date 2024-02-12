import { Component } from '@angular/core';
import {LocationService} from "../location.service";
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private locationService : LocationService, private weatherService: WeatherService) { }

  addLocation(zipcode : string){
    let index = this.locationService.locations.indexOf(zipcode);
    if (index === -1){
      this.locationService.addLocation(zipcode);
      this.weatherService.addCurrentConditions(zipcode);
    }
  }

}
