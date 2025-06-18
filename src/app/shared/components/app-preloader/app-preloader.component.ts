import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './app-preloader.component.html',
  styleUrls: ['./app-preloader.component.scss'],
})
export class AppPreloaderComponent implements OnInit {

  @Input() show = false;

  constructor() { }

  ngOnInit(): void {
    if (1) { }
  }

}
