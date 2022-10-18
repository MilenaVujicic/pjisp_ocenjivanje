import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { AppUserComponent } from './app-user/app-user.component';
import { SuperuserComponent } from './app-user/superuser/superuser.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavBarComponent } from './main-page/nav-bar/nav-bar.component';
import { AddUserComponent } from './app-user/superuser/add-user/add-user.component';
import { LoginComponent } from './app-user/login/login.component';
import { UserViewComponent } from './main-page/user-view/user-view.component';
import { ResultsPageComponent } from './results-page/results-page.component';
import { StatisticsPageComponent } from './statistics-page/statistics-page.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import {DecimalPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import { ChartPageComponent } from './statistics-page/chart-page/chart-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AppUserComponent,
    SuperuserComponent,
    NavBarComponent,
    AddUserComponent,
    LoginComponent,
    UserViewComponent,
    ResultsPageComponent,
    StatisticsPageComponent,
    LogsPageComponent,
    ChartPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
