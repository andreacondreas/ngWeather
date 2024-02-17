import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { SettingsComponent } from './settings/settings.component';

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'forecast/:zipcode', component: ForecastsListComponent
  },
  {
    path: 'settings', component: SettingsComponent
  }
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, {});
