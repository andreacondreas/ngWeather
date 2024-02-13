import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { LocationService } from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { WeatherService } from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { WeatherIconDirective } from './weatherIcon.directive';
import { OnlyNumbers } from './onlyNumbers.directive';
import { TabComponent } from './tabs/tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

export interface AppConfig {
  URL: string;
  APPID: string;
  ICON_URL: string;
}

export const AppConfig: AppConfig = {
  URL: 'http://api.openweathermap.org/data/2.5',
  APPID: '5a4b2d457ecbef9eb2a71e480b947604',
  ICON_URL: 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/',
};

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    WeatherIconDirective,
    OnlyNumbers,
    TabsComponent,
    TabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    LocationService,
    WeatherService,
    { provide: AppConfig, useValue: AppConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
