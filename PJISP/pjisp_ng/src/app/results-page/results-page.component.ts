import { Component, OnInit } from '@angular/core';
import {ResultsFormat} from "../../models/ResultsFormat";
import {AppUser} from "../../models/AppUser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit {

  resultsFormat:ResultsFormat = {
    resultType: "",
    examType:"",
    testType:"",
    file: ""
  }

  currentUser:AppUser = {
    first_name: "",
    last_name: "",
    email:""
  }

  resultTypes: string[] = ["Exam Result", "Test Result"];
  selectedType: string = "";
  changed:boolean = false
  selectedExamType: string = "";
  selectedTestType: string = "";
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  sendResults():void{
    this.currentUser.email = String(localStorage.getItem('user'));
    this.resultsFormat.resultType = this.selectedType;
    this.resultsFormat.examType = this.selectedExamType
    this.resultsFormat.testType = this.selectedTestType
    if(this.selectedType === ""){
      alert("Select test type");
      return;
    }

    if(this.selectedExamType === "" && this.selectedType == this.resultTypes[0]){
      alert("Select exam type");
      return;
    }
    this.testResultsObservable(this.resultsFormat, this.currentUser).subscribe(
      (res: any)=>{
        console.log(res);
        location.reload();
      },
      err=>{
          console.log(err.message);
          alert("Something went wrong");
      });

  }
  fileChange(event):void{

    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event)=>{
        this.changed = true;
        // @ts-ignore
        this.resultsFormat.file = event.target.result;
      }
    }
  }

  testResultsObservable(result:ResultsFormat, user:AppUser){
    let url = "";
    if (this.selectedType === this.resultTypes[1]){
      url = "http://";
      let server = "localhost"
      let port = "8000";
      url = url + server + ":" + port + "/test_results/";
    }else if (this.selectedType === this.resultTypes[0]){
      url = "http://";
      let server = "localhost"
      let port = "8000";
      url = url + server + ":" + port + "/exam_results/";
    }
    let data = [result, user];
    return this.http.post<Object>(url, data);

  }


}
