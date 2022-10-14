import { Component, OnInit } from '@angular/core';
import {AppUser} from "../../../../models/AppUser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userModel:AppUser = {
    email:"",
    first_name:"",
    last_name:"",

  };
  adminModel:AppUser = {
    email:"",
    first_name:"",
    last_name:"",
  }
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  sendUser():void{
    this.userObservable(this.userModel, this.adminModel).subscribe(
      (res:AppUser) => {
        console.log(res);
        location.href='logged';
      },
      err => {
        alert("Something went wrong");
        console.log(err.message);
      }
    )
  }
  userObservable(user:AppUser, admin:AppUser){
    let url = "http://";
    let server = "localhost"
    let port = "8000";
    url = url + server + ":" + port + "/add_user/";
    let data = [user, admin]
    return this.http.post<AppUser>(url, data);
  }


}
