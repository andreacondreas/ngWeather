import { Injectable, Signal, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { environment } from 'environments/environment';

@Injectable()
export class WeatherService {

  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient) { }

  addCurrentConditions(zipcode: string): void {
    if (this._findCoditionDuplicate(zipcode))
      return;
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(this._getUrl(zipcode))
      .subscribe(data => this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]),
        () => this.removeCurrentConditions(zipcode));
  }

  initStoredConditions(restCall$: Array<Observable<CurrentConditions>>, zipcodes: string[]): void {
    // const restCall$: Array<Observable<CurrentConditions>> = [];
    // zipcodes.forEach(zipcode => restCall$.push(this.http.get<CurrentConditions>(this._getUrl(zipcode))));
    forkJoin(restCall$).subscribe(
      (resp: CurrentConditions[]) => {
        resp.forEach((data, index) => {
          if (this._findCoditionDuplicate(zipcodes[index]))
            return;
          this.currentConditions.update(conditions => [...conditions, { zip: zipcodes[index], data }]);
        });
      }
    );
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
