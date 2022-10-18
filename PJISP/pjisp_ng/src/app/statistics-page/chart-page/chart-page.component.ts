import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {Chart, registerables} from "chart.js";

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css']
})
export class ChartPageComponent implements OnInit {
  @ViewChild('chart') canvas: ElementRef | undefined;
  chart: any;
  grades:number[];

  ngAfterViewInit(): void{
    if(localStorage.getItem("grades") !== null)
      this.initBarChart();
  }
  constructor() { }

  initBarChart(){
    this.chart = new Chart(this.canvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: ['6', '7', '8', '9', '10'],
        datasets: [
          {
            label: '# of Students',
            data: [this.grades[1], this.grades[2], this.grades[3], this.grades[4], this.grades[5]],
            backgroundColor: [
              'rgba(31, 66, 255, 0.3)',
              'rgba(31, 220, 255, 0.3)',
              'rgba(31, 255, 112, 0.3)',
              'rgba(239, 255, 31, 0.3)',
              'rgba(255, 31, 31, 0.3)',
            ],

          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  ngOnInit(): void {
    if(localStorage.getItem("grades") !== null){
      // @ts-ignore
      this.grades = JSON.parse(localStorage.getItem("grades"));


      let d = [{label:"A", data:0.5, backgroundColor:'red'}, {label: "B", data:0.7, backgroundColor: 'blue'}];
      Chart.register(...registerables)

      // @ts-ignore
      const canvas = <HTMLCanvasElement> document.getElementById("chart");
      const ctx = canvas.getContext('2d');
      // @ts-ignore

    }
  }

}
