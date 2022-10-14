import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  isAdmin:string | null = localStorage.getItem('isAdmin');

  constructor() { }

  ngOnInit(): void {
  }


  logout():void{
    localStorage.setItem('user', "")
    localStorage.setItem('isAdmin', "false")
    location.href= 'index';

  }
}
