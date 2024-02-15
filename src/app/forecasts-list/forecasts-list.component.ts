import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { CacheRequestService } from 'app/cache-request.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute, private cacheRequestService: CacheRequestService) {
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      const storedForecast: Forecast = this.cacheRequestService.getStoredForecast(this.zipcode);
      if (storedForecast) {
        this.forecast = storedForecast;
        return;
      }
      weatherService.getForecast(this.zipcode)
        .subscribe(data => {
          this.forecast = data;
          this.cacheRequestService.storeForecast(this.zipcode, data);
        });
    });
  }

  trackByDt(index: number, item: { dt: number; }) {
    return item.dt;
  }
}
