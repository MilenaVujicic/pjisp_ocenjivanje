import { Component, OnInit } from '@angular/core';
import {AppUser} from "../../../models/AppUser";
import {HttpClient} from "@angular/common/http";
import {Environment} from "@angular/cli/lib/config/workspace-schema";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:AppUser = {
    email:"",
    first_name:"",
    last_name:"",
    password:"",
  };

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  sendUser():void{
    this.userObservable(this.user).subscribe(
      (res:AppUser) => {
        let is_admin = false;
        console.log(res);
        if (res.is_admin != null){
          is_admin = res.is_admin;
        }

        localStorage.setItem("user", res.email);
        localStorage.setItem("isAdmin", String(is_admin));
        location.href='logged';
      },
      err => {
        alert("Something went wrong");
        console.log(err.message);
      }
    )
  }


  userObservable(appUser:AppUser){
    let url = "http://";
    let server = "localhost"
    let port = "8000";
    url = url + server + ":" + port + "/login/";
    let user = JSON.stringify(appUser);
    return this.http.post<AppUser>(url, user);

  }
}
