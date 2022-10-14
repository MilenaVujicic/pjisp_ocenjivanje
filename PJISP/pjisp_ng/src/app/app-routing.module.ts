import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SuperuserComponent} from "./app-user/superuser/superuser.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {AddUserComponent} from "./app-user/superuser/add-user/add-user.component";
import {LoginComponent} from "./app-user/login/login.component";
import {UserViewComponent} from "./main-page/user-view/user-view.component";
import {NavBarComponent} from "./main-page/nav-bar/nav-bar.component";


const routes:Routes = [
  {
    path:'create_superuser',
    component:SuperuserComponent
  },
  {
    path:'add_user',
    component:AddUserComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'logged',
    component:MainPageComponent
  },
  {
    path:'results',
    component:MainPageComponent
  },
  {
    path:'statistics',
    component:MainPageComponent
  },
  {
    path:'logs',
    component:MainPageComponent
  },
  {
    path:'**',
    redirectTo:'index',
  },
  {
    path:'index',
    component:MainPageComponent
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})

export class AppRoutingModule { }
