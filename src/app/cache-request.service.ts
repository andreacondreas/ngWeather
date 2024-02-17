import { Injectable } from '@angular/core';
import { Forecast, ForecastAndDate } from './forecasts-list/forecast.type';
import { ConditionsAndZip, ConditionsAndZipAndDate } from './conditions-and-zip.type';
import { FORECAST } from './constants/forecast';
import { CONDITIONS_AND_ZIP } from './constants/conditions-anf-zip';
import { MAX_REQUEST_LIFE } from './constants/max-request-life';

@Injectable()
export class CacheRequestService {

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
        localStorage.setItem(key, JSON.stringify({ ...value, storedDate: new Date().getTime() }));
    }

    getStoredForecast(zipcode): ForecastAndDate {
        const key: string = zipcode + '-' + FORECAST;
        const storedForecast: ForecastAndDate = JSON.parse(localStorage.getItem(key));
        debugger;
        if (!this.checkRequestLife(storedForecast))
            return null;
        if (storedForecast) {
            delete storedForecast['storedDate'];
        }
        return storedForecast;
    }


    getStoredConditionsAndZip(zipcode): ConditionsAndZip {
        const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
        let storedCondition: ConditionsAndZipAndDate = JSON.parse(localStorage.getItem(key));
        if (!this.checkRequestLife(storedCondition)) {
            return null;
        } else {
            delete storedCondition['storedDate'];
        }
        return storedCondition;
    }

    getStoredConditionsAndZipAndDate(zipcode): ConditionsAndZipAndDate {
        const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
        let storedCondition: ConditionsAndZipAndDate = JSON.parse(localStorage.getItem(key));
        return storedCondition;
    }

    getStoredForecastAndDate(zipcode): ForecastAndDate {
        const key: string = zipcode + '-' + FORECAST;
        let storedCondition: ForecastAndDate = JSON.parse(localStorage.getItem(key));
        return storedCondition;
    }

    getAllStoredConditionsAndZip(zipcodes: string[]): ConditionsAndZip[] {
        const storedConditions: ConditionsAndZip[] = [];
        zipcodes.forEach(zipcode => {
            //search zipcode in stored ConditionsAndZip in localStorage
            const condition: ConditionsAndZipAndDate = this.getStoredConditionsAndZipAndDate(zipcode);
            delete condition['storedDate'];
            storedConditions.push(condition);
        });
        return storedConditions;
    }

    checkRequestLife(storedRequest: ConditionsAndZipAndDate | ForecastAndDate): boolean {
        if (!storedRequest)
            return;
        const requestAge: number = storedRequest.storedDate + parseInt(localStorage.getItem(MAX_REQUEST_LIFE));
        const now: number = new Date().getTime();
        return requestAge > now;
    }

    getRequestRemainigLife(storedRequest: ConditionsAndZipAndDate | ForecastAndDate): number {
        const maxLife: number = +localStorage.getItem(MAX_REQUEST_LIFE);
        const storedData: number = storedRequest.storedDate;
        const now: number = new Date().getTime();
        const storeDataLife: number = now - storedData;
        return maxLife - storeDataLife > 0 ? maxLife - storeDataLife : 0;
    }

    removeStoredRequest(key: string) {
        localStorage.removeItem(key + '-' + CONDITIONS_AND_ZIP);
        localStorage.removeItem(key + '-' + FORECAST);
    }
}
