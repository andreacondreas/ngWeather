import { Component, OnDestroy, Signal, effect } from '@angular/core';
import { CacheRequestService } from 'app/cache-request.service';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { DEFAULT_REQUEST_LIFE } from 'app/constants/default-request-life';
import { LOCATIONS } from 'app/constants/locations';
import { MAX_REQUEST_LIFE } from 'app/constants/max-request-life';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';
import { Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnDestroy {
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  maxRequestLife: number;

  stopped$ = new Subject<boolean>();

  constructor(private weatherService: WeatherService, private locationService: LocationService, private cacheRequestService: CacheRequestService) {

    let locString = localStorage.getItem(LOCATIONS);
    // set default request life
    if (!localStorage.getItem(MAX_REQUEST_LIFE)) {
      localStorage.setItem(MAX_REQUEST_LIFE, DEFAULT_REQUEST_LIFE);
    }
    //get request life
    this.maxRequestLife = +localStorage.getItem(MAX_REQUEST_LIFE);
    //get stored locations
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    //get all stored requests
    const storedConditions: ConditionsAndZip[] = this.cacheRequestService.getAllStoredConditionsAndZip(this.locationService.locations);
    if (storedConditions)
      this.weatherService.initStoredConditions(storedConditions);
    effect(() => {
      // if user add a new valid location then add zipcode in localstorage
      const locationsCounter: number = this.currentConditionsByZip().length;
      const currentConditionsAndZip: ConditionsAndZip = this.currentConditionsByZip()[locationsCounter - 1];
      const zipcode = currentConditionsAndZip?.zip;
      const index = this.locationService.locations.indexOf(zipcode);
      if (zipcode && index === -1) {
        // if is new zipcode then update stored locations
        this.locationService.addLocation(zipcode);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  addLocation(zipcode: string): void {
    // get entered zip location from zipcode-entry
    let index = this.locationService.locations.indexOf(zipcode);
    // if is new zip location update current conditions
    if (index === -1)
      this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string): void {
    this.cacheRequestService.removeStoredRequest(zipcode);
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
    if (!this.locationService.locations.length) {
      // stop timer if there is'nt any stored location
      this.stopped$.next(true);
    }
  }

  selectCurrentCondition(index: number): void {
    // on change tab stop timer
    this.stopped$.next(true);
    // lget selecetd zipcode
    const zipcode: string = this.locationService.locations[index];
    // get selected condition
    const selectedCondition: ConditionsAndZip = this.cacheRequestService.getStoredConditionsAndZip(zipcode);
    // get remain life of selected request
    const requestRemainigLife: number = this.cacheRequestService.getRequestRemainigLife(selectedCondition);
    // start timer when request life finish
    timer(requestRemainigLife)
      .pipe(
        takeUntil(this.stopped$)
      )
      .subscribe(() => {
        this.startTimer(zipcode, index);
      });
  }

  startTimer(zipcode: string, tabIndex: number): void {
    this.stopped$.next(false);
    timer(0, this.maxRequestLife).pipe(
      tap((x) => {
        this.weatherService.refreshCondition(zipcode, tabIndex, this.locationService.locations);
      }),
      takeUntil(this.stopped$)
    ).subscribe();
  }

  private stopTimer(): void {
    setTimeout(() => {
      this.stopped$.next(true);
      this.stopped$.unsubscribe();
    });
  }
}
