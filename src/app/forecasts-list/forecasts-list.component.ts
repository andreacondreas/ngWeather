import { Component, OnDestroy } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { CacheRequestService } from 'app/cache-request.service';
import { LocationService } from 'app/location.service';
import { Subject, timer } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { MAX_REQUEST_LIFE } from 'app/constants/max-request-life';
import { DEFAULT_REQUEST_LIFE } from 'app/constants/default-request-life';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnDestroy {

  zipcode: string;
  forecast: Forecast;
  stopped$ = new Subject<boolean>();
  maxRequestLife: number;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute, private cacheRequestService: CacheRequestService, private locationService: LocationService) {
    if (!localStorage.getItem(MAX_REQUEST_LIFE)) {
      localStorage.setItem(MAX_REQUEST_LIFE, DEFAULT_REQUEST_LIFE);
    }
    this.maxRequestLife = +localStorage.getItem(MAX_REQUEST_LIFE);
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      const storedForecast: Forecast = this.cacheRequestService.getStoredForecast(this.zipcode);
      if (storedForecast) {
        const requestRemainigLife: number = this.cacheRequestService.getRequestRemainigLife(storedForecast);
        this.forecast = storedForecast;
        timer(requestRemainigLife)
          .pipe(
            take(1)
          )
          .subscribe(() => {
            this.startTimer();
          });
        return;
      }
      this.startTimer();
    });
  }

  ngOnDestroy(): void {
    this.stopped$.next(true);
    this.stopped$.unsubscribe();
  }

  getData(): void {
    this.weatherService.getForecast(this.zipcode)
      .subscribe(data => {
        this.forecast = data;
        this.cacheRequestService.storeForecast(this.zipcode, data);
      });
  }

  startTimer(): void {
    timer(0, this.maxRequestLife).pipe(
      tap((x) => {
        this.getData();
      }),
      takeUntil(this.stopped$)
    ).subscribe();
  }

  trackByDt(index: number, item: { dt: number; }) {
    return item.dt;
  }
}
