import { Component, OnInit } from '@angular/core';
import {AppUser} from "../../models/AppUser";
import {Count} from "../../models/Count";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {Environment} from "@angular/cli/lib/config/workspace-schema";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  userModel:AppUser = {
    "email":"",
    "first_name":"",
    "last_name":"",
    "password":"",
    "is_staff":true,
    "is_superuser":true,
    "is_admin":true
  };

  user_count = 0;

  current_user: string | null;

  constructor(private http:HttpClient, public _route:Router) { }

  ngOnInit(): void {
    this.current_user = localStorage.getItem("user");
    console.log(this.current_user)
    this.getUserCount().subscribe((res:Count)=> {
      this.user_count = res.count;
      console.log(this.user_count);
    });

  }


createSuperUser(){
    location.href="create_superuser";
}

login(){
    location.href="login";
}

getUserCount(){
    let url = "http://";
    let server = "localhost"
    let port = "8000";
    url = url + server + ":" + port + "/check_users/";
    return this.http.get<Count>(url);
  }
}
