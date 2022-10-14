import { Component, OnInit } from '@angular/core';
import {AppUser} from "../../../models/AppUser";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-superuser',
  templateUrl: './superuser.component.html',
  styleUrls: ['./superuser.component.css']
})
export class SuperuserComponent implements OnInit {

  userModel:AppUser = {
  email:"",
  first_name:"",
  last_name:"",
    is_admin: true,
    is_superuser:true,
    is_staff: true

};

  constructor(private http:HttpClient, public _route:Router) { }

  ngOnInit(): void {
  }

  sendUser():void{
    this.userObservable(this.userModel).subscribe(
      (res:AppUser) => {
        console.log(res);
        location.href='index';
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
    url = url + server + ":" + port + "/create_superuser/";
    return this.http.post<AppUser>(url, appUser);
  }
}
