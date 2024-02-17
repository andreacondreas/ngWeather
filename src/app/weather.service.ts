import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { environment } from 'environments/environment';
import { CacheRequestService } from './cache-request.service';

@Injectable()
export class WeatherService {

  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private cacheRequestService: CacheRequestService) { }

  addCurrentConditions(zipcode: string): void {
    if (this._findCoditionDuplicate(zipcode))
      return;
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(this._getUrl(zipcode))
      .subscribe(data => {
        this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
        this.cacheRequestService.storeConditionsAndZip(zipcode, { zip: zipcode, data });
      },
        () => this.removeCurrentConditions(zipcode));
  }

  refreshCondition(zipcode: string, index: number, locations: string[]): void {
    this.http.get<CurrentConditions>(this._getUrl(zipcode))
      .subscribe(data => {
        if (locations.indexOf(zipcode) !== -1) {
          this.currentConditions.update(() => this._updateCondition(index, data, zipcode));
          this.cacheRequestService.storeConditionsAndZip(zipcode, { data: data, zip: zipcode });
        }
      });
  }

  private _updateCondition(index: number, condition: CurrentConditions, zipcode: string): ConditionsAndZip[] {
    const arr: ConditionsAndZip[] = this.currentConditions();
    arr[index] = { data: condition, zip: zipcode };
    return arr;
  }

  initStoredConditions(storedConditions: ConditionsAndZip[]): void {
    this.currentConditions.update(condition => storedConditions);
  }

  private _getUrl(zipcode: string): string {
    return `${environment.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${environment.APPID}`;
  }

  private _findCoditionDuplicate(zipcode: string): boolean {
    return this.currentConditions().some(conditions => conditions.zip === zipcode);
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${environment.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${environment.APPID}`);

  }

}
