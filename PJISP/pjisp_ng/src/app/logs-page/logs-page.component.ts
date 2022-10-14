import { Component, OnInit, PipeTransform  } from '@angular/core';
import {Log} from "../../models/Log";
import {HttpClient} from "@angular/common/http";

import {DecimalPipe} from "@angular/common";
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-logs-page',
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.css']
})
export class LogsPageComponent implements OnInit {

  log:Log = {
    date: new Date('1-1-2000'),
    exam: -1,
    first_name: "",
    id: -1,
    index_number: "",
    last_name: "",
    p1: -1,
    p2: -1,
    sov: -1,
    t1234: -1,
    user: undefined

  }
  logs:Log[];

  constructor(private http:HttpClient) {
  }




  ngOnInit(): void {
    this.logsObservable().subscribe(
      (res:Log[]) => {
        this.logs = res;
        for (let l of this.logs){
          if (l.user !== undefined){
            l.userStr = l.user.email;
          }
        }
      },
      err=>{
        console.log(err.message);
        alert("Something went wrong");
      })
  }

  logsObservable(){
    let url = "http://";
    let server = "localhost"
    let port = "8000";
    url = url + server + ":" + port + "/log/";
    return this.http.get<Log[]>(url);
  }


}
