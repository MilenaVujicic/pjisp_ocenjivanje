import {Component, OnInit, PipeTransform} from '@angular/core';
import {Log} from "../../models/Log";
import {HttpClient} from "@angular/common/http";
import {Chart, registerables } from 'chart.js';
import {DecimalPipe, UpperCasePipe} from "@angular/common";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";


let tableData:Log[] = [];
function search(text:string, pipe:PipeTransform):Log[]{
  console.log("SEARCH");
  return tableData.filter(data => {
    const term = text.toUpperCase();
    return data.index_number.includes(term)
      || pipe.transform(data.first_name).includes(term)
      || pipe.transform(data.last_name).includes(term);
  });
}

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css'],
  providers: [UpperCasePipe]
})
export class StatisticsPageComponent implements OnInit {

  statsOptions: string[] = ["Student Data", "Averages"];
  selectedOption: string = "";
  gradeMap:Map<string, string>;
  chart: Chart;

  data$: Observable<Log[]>
  filter = new FormControl('', {nonNullable: true});

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
  displayChart:boolean = false;

  grades:number[] = [0, 0, 0, 0, 0, 0] // [5, 6, 7, 8, 9, 10]




  hidden: Boolean = true;
  constructor(private http:HttpClient, pipe:UpperCasePipe) {
    this.data$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text=>search(text, pipe)))
  }

  ngOnInit(): void {
    this.logsObservable().subscribe(
      (res:Log[]) => {
        tableData = res;
        this.allData = tableData;
        for(let d of this.allData){
          d.grade = this.calculateGrade(d);

        }


      },
      err=>{
        console.log(err.message);
       // alert("Something went wrong");
      });


  }

  getTableData(){
    return tableData;
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
    let total = 0;
    let sum = 0;
    let average =0;
    total = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
    sum = this.grades[5]*10 + this.grades[4]*9 + this.grades[3]*8 +this.grades[2]*7 + this.grades[1]*6;
    average = sum/total;
    let average_str = average.toString();
    return parseFloat(average_str).toFixed(2);
  }

  passed(){
    return  this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
  }

  failed(){
    return this.grades[0]
  }

  percentPassed(){
    let total = 0;
    let passed = 0;
    let average = 0;
    total = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1] + this.grades[0];
    passed = this.grades[5] + this.grades[4] + this.grades[3] +this.grades[2] + this.grades[1];
    average = passed/total * 100;
    let passed_str = average.toString();
    return parseFloat(passed_str).toFixed(2);

  }

  showChart():void{
    localStorage.setItem("grades", JSON.stringify(this.grades));
    this.displayChart = !this.displayChart;
  }
}
