import { Injectable } from '@angular/core';
import { Forecast } from './forecasts-list/forecast.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
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

    getStoredConditionsAndZip(zipcode): ConditionsAndZip {
        const key: string = zipcode + '-' + CONDITIONS_AND_ZIP;
        let storedCondition: ConditionsAndZip = JSON.parse(localStorage.getItem(key));
        return storedCondition;
    }

    getStoredForecast(zipcode): Forecast {
        const key: string = zipcode + '-' + FORECAST;
        let storedCondition: Forecast = JSON.parse(localStorage.getItem(key));
        return storedCondition;
    }

    getAllStoredConditionsAndZip(zipcodes: string[]): ConditionsAndZip[] {
        const storedConditions: ConditionsAndZip[] = [];
        zipcodes.forEach(zipcode => {
            //search zipcode in stored ConditionsAndZip in localStorage
            const condition: ConditionsAndZip = this.getStoredConditionsAndZip(zipcode);
            storedConditions.push(condition);
        });
        return storedConditions;
    }

    getRequestRemainigLife(storedRequest: ConditionsAndZip | Forecast): number {
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
