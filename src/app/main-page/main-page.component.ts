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
    if (!localStorage.getItem(MAX_REQUEST_LIFE)) {
      localStorage.setItem(MAX_REQUEST_LIFE, DEFAULT_REQUEST_LIFE);
    }
    this.maxRequestLife = +localStorage.getItem(MAX_REQUEST_LIFE);
    if (locString)
      this.locationService.locations = JSON.parse(locString);
    const storedConditions: ConditionsAndZip[] = this.cacheRequestService.getAllStoredConditionsAndZip(this.locationService.locations);
    if (storedConditions)
      this.weatherService.initStoredConditions(storedConditions);
    effect(() => {
      // if user add a valid location then add zipcode in localstorage
      const locationsCounter: number = this.currentConditionsByZip().length;
      const currentConditionsAndZip: ConditionsAndZip = this.currentConditionsByZip()[locationsCounter - 1];
      const zipcode = currentConditionsAndZip?.zip;
      const index = this.locationService.locations.indexOf(zipcode);
      // if user add a zipcode not just included in locationService.locations
      if (zipcode && index === -1) {
        this.locationService.addLocation(zipcode);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  addLocation(zipcode: string): void {
    let index = this.locationService.locations.indexOf(zipcode);
    if (index === -1)
      this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string): void {
    this.cacheRequestService.removeStoredRequest(zipcode);
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
    if (!this.locationService.locations.length) {
      this.stopTimer();
    }
  }

  selectCurrentCondition(index: number): void {
    this.stopped$.next(true);
    // la currentCondition è già presente e l'ho selezionata
    const zipcode: string = this.locationService.locations[index];
    const selectedCondition: ConditionsAndZip = this.cacheRequestService.getStoredConditionsAndZip(zipcode);
    const requestRemainigLife: number = this.cacheRequestService.getRequestRemainigLife(selectedCondition);

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
    this.stopped$.next(true);
    this.stopped$.unsubscribe();
  }
}
