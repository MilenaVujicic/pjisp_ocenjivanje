import {Component, OnInit, PipeTransform} from '@angular/core';
import {Log} from "../../models/Log";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  statsOptions: string[] = ["Student Data", "Averages"];
  selectedOption: string = "";

  data:Log = {
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
  allData:Log[];

  x_label:string = "Grades"
  y_label:string = "Total"

  grades:number[] = [0, 0, 0, 0, 0, 0] // [5, 6, 7, 8, 9, 10]
  x_axis:number[] = [5, 6, 7, 8, 9, 10]

  grades_bar = [{
    "grade": 5, "total": this.grades[0]
  },
    {
      "grade": 6, "total": this.grades[1]
    },
    {
      "grade": 7, "total": this.grades[2]
    },
    {
      "grade": 8, "total": this.grades[3]
    },
    {
      "grade": 9, "total": this.grades[4]
    },
    {
      "grade": 10, "total": this.grades[5]
    }];

  constructor(private http:HttpClient) {

  }

  ngOnInit(): void {
    this.logsObservable().subscribe(
      (res:Log[]) => {
        this.allData = res;

      },
      err=>{
        console.log(err.message);
       // alert("Something went wrong");
      })
  }

  logsObservable(){
    let url = "http://";
    let server = "localhost"
    let port = "8000";
    url = url + server + ":" + port + "/statistics/";
    return this.http.get<Log[]>(url);
  }

  calculateGrade(d:Log):number{
    let sum = 0;
    let i = 0;

    if(d.exam)
      if (d.exam > 0)
        sum += d.exam;

    if(d.p1)
      if(d.p1 >0)
        sum += d.p1;

    if(d.p2)
      if(d.p2>0)
        sum += d.p2;

    if(d.sov)
      if(d.sov>0)
        sum += d.sov;

    if(d.t1234)
      if(d.t1234>0)
        sum+= d.t1234;


    if (sum >= 91 && sum <= 100) {
      this.grades[5]++;
      return 10;
    }
    else if(sum >= 81 && sum <= 90) {
      this.grades[4]++;
      return 9;
    }
    else if(sum >= 71 && sum <= 80) {
      this.grades[3]++;
      return 8;
    }
    else if(sum >= 61 && sum <=70) {
      this.grades[2]++;
      return 7;
    }
    else if(sum >=51 && sum <=60) {
      this.grades[1]++;
      return 6;
    }
    else {
      this.grades[0]++;
      return 5
    }
  }

  averageGrade(){
    let total = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
    let sum = this.grades[5]*10 + this.grades[4]*9 + this.grades[3]*8 +this.grades[2]*7 + this.grades[1]*6;
    return sum/total;
  }

  passed(){
    return  this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
  }

  failed(){
    return this.grades[0]
  }

  percentPassed(){
    let total = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1] + this.grades[0];
    let passed = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
    return Math.round(((passed/total)*100)*100)/100;

  }
}
