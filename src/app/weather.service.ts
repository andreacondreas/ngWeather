import { Injectable, Signal, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { AppConfig } from './app.module';

@Injectable()
export class WeatherService {

  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  addCurrentConditions(zipcode: string): void {
    const duplicateCondition: boolean = this.currentConditions().some(conditions => conditions.zip === zipcode);
    if (this._findCoditionDuplicate(zipcode))
      return;
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${this.appConfig.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${this.appConfig.APPID}`)
      .subscribe(data => this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]),
        () => this.removeCurrentConditions(zipcode));
  }

  initStoredConditions(zipcodes: string[]): void {
    const restCall$: Array<Observable<CurrentConditions>> = [];
    zipcodes.forEach(zipcode => restCall$.push(this.http.get<CurrentConditions>(`${this.appConfig.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${this.appConfig.APPID}`)));
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
    return this.http.get<Forecast>(`${this.appConfig.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${this.appConfig.APPID}`);

  }

}
