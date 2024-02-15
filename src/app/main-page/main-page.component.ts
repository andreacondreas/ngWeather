import { Component, Signal, effect } from '@angular/core';
import { CacheRequestService } from 'app/cache-request.service';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { DEFAULT_REQUEST_LIFE } from 'app/constants/default-request-life';
import { LOCATIONS } from 'app/constants/locations';
import { MAX_REQUEST_LIFE } from 'app/constants/max-request-life';
import { CurrentConditions } from 'app/current-conditions/current-conditions.type';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  constructor(private weatherService: WeatherService, private locationService: LocationService, private cacheRequestService: CacheRequestService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (!localStorage.getItem(MAX_REQUEST_LIFE)) {
      localStorage.setItem(MAX_REQUEST_LIFE, DEFAULT_REQUEST_LIFE);
    }
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    const restcalls$: Array<Observable<CurrentConditions>> = this.cacheRequestService.getAllStoredConditionsAndZip(this.locationService.locations);
    this.weatherService.initStoredConditions(restcalls$, this.locationService.locations);
    effect(() => {
      // if user add a valid location then add zipcode in localstorage
      const locationsCounter: number = this.currentConditionsByZip().length;
      const currentConditionsAndZip: ConditionsAndZip = this.currentConditionsByZip()[locationsCounter - 1];
      const zipcode = currentConditionsAndZip?.zip;
      const index = this.locationService.locations.indexOf(zipcode);
      // if user add a zipcode not just included in locationService.locations
      if (zipcode && index === -1) {
        this.locationService.addLocation(zipcode);
        this.cacheRequestService.storeConditionsAndZip(zipcode, currentConditionsAndZip);
      }
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
