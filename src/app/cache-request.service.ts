import { Injectable } from '@angular/core';
import { Forecast } from './forecasts-list/forecast.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { FORECAST } from './constants/forecast';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { environment } from 'environments/environment';
import { CONDITIONS_AND_ZIP } from './constants/conditions-anf-zip';
import { MAX_REQUEST_LIFE } from './constants/max-request-life';

interface ForecastAndDate extends Forecast {
    storedDate: number;
}

interface ConditionsAndZipAndDate extends ConditionsAndZip {
    storedDate: number;
}

@Injectable()
export class CacheRequestService {

    constructor(private http: HttpClient) {

    }

    private _getUrl(zipcode: string): string {
        return `${environment.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${environment.APPID}`;
    }

    storeForecast(zipcode: string, value: Forecast): void {
        if (!zipcode)
            return;
        const key: string = zipcode + '-' + FORECAST;
        localStorage.setItem(key, JSON.stringify({ ...value, storedDate: new Date().getTime() }));
    }

    storeConditionsAndZip(zipcode: string, value: ConditionsAndZip): void {
        if (!zipcode)
            return;
        const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
        debugger;
        localStorage.setItem(key, JSON.stringify({ ...value, storedDate: new Date().getTime() }));
    }

    getStoredForecast(zipcode): Forecast {
        const key: string = zipcode + '-' + FORECAST;
        const storedForecast: ForecastAndDate = JSON.parse(localStorage.getItem(key));
        if (!this._checkRequestLife(storedForecast))
            return null;
        if (storedForecast) {
            delete storedForecast['storedDate'];
        }
        return storedForecast;
    }


    getStoredConditionsAndZip(zipcode): ConditionsAndZip {
        const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
        let storedCondition: ConditionsAndZipAndDate = JSON.parse(localStorage.getItem(key));
        if (!this._checkRequestLife(storedCondition)) {
            return null;
        } else {
            delete storedCondition['storedDate'];
        }
        return storedCondition;
    }

    getAllStoredConditionsAndZip(zipcodes: string[]): Array<Observable<CurrentConditions>> {
        const restCall$: Array<Observable<CurrentConditions>> = [];
        zipcodes.forEach(zipcode => {
            //search zipcode in stored ConditionsAndZip in localStorage
            if (localStorage.getItem(zipcode + '-' + CONDITIONS_AND_ZIP)) {
                const storedCondition: ConditionsAndZip = this.getStoredConditionsAndZip(zipcode);
                restCall$.push(storedCondition ? of(storedCondition.data) : this.http.get<CurrentConditions>(this._getUrl(zipcode)));
            } else {
                restCall$.push(this.http.get<CurrentConditions>(this._getUrl(zipcode)));
            }
        });
        return restCall$;
    }

    // getStoredConditionsAndZip(zipcode): ConditionsAndZip {
    //     const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
    //     const storedCondition: ConditionsAndZipAndDate = JSON.parse(localStorage.getItem(key));
    //     if (storedCondition) {
    //         delete storedCondition['storedDate'];
    //     }
    //     return storedCondition;
    // }

    // getAllStoredConditionsAndZip(zipcodes: string[]): Array<Observable<CurrentConditions>> {
    //     const restCall$: Array<Observable<CurrentConditions>> = [];
    //     zipcodes.forEach(zipcode => {
    //         //search zipcode in stored ConditionsAndZip in localStorage
    //         if (localStorage.getItem(zipcode + '-' + CONDITIONS_AND_ZIP)) {
    //             restCall$.push(of(this.getStoredConditionsAndZip(zipcode).data));
    //         } else {
    //             restCall$.push(this.http.get<CurrentConditions>(this._getUrl(zipcode)));
    //         }
    //     });
    //     return restCall$;
    // }

    private _checkRequestLife(storedRequest: ConditionsAndZipAndDate | ForecastAndDate): boolean {
        if (!storedRequest)
            return;
        const requestAge: number = storedRequest.storedDate + parseInt(localStorage.getItem(MAX_REQUEST_LIFE));
        const now: number = new Date().getTime();
        return requestAge > now;
    }

    removeStoredRequest(key: string) {
        localStorage.removeItem(key);
    }
}
