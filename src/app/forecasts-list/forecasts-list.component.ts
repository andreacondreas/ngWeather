import { Component, OnDestroy } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast, ForecastAndDate } from './forecast.type';
import { CacheRequestService } from 'app/cache-request.service';
import { LocationService } from 'app/location.service';
import { Subject, timer } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnDestroy {

  zipcode: string;
  forecast: Forecast;
  stopped$ = new Subject<boolean>();

  constructor(protected weatherService: WeatherService, route: ActivatedRoute, private cacheRequestService: CacheRequestService, private locationService: LocationService) {
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      const storedForecast: ForecastAndDate = this.cacheRequestService.getStoredForecastAndDate(this.zipcode);
      if (storedForecast) {
        const requestRemainigLife: number = this.cacheRequestService.getRequestRemainigLife(storedForecast);
        this.forecast = storedForecast;
        timer(requestRemainigLife)
          .pipe(
            take(1)
          )
          .subscribe(() => {
            this._startTimer();
          });
        return;
      }
      this._startTimer();
    });
  }

  ngOnDestroy(): void {
    this.stopped$.next(true);
  }

  private _getData(): void {
    this.weatherService.getForecast(this.zipcode)
      .subscribe(data => {
        this.forecast = data;
        this.cacheRequestService.storeForecast(this.zipcode, data);
      });
  }

  private _startTimer(): void {
    timer(0, 5000).pipe(
      tap((x) => {
        this._getData();
      }),
      takeUntil(this.stopped$)
    ).subscribe();
  }

  trackByDt(index: number, item: { dt: number; }) {
    return item.dt;
  }
}
