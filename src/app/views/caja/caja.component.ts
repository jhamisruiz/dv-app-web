import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateStore } from '@store/app.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss'],
})
export class CajaComponent implements OnInit {

  loading$: Observable<boolean> = new Observable();

  constructor(private store: Store<AppStateStore>) { }

  ngOnInit(): void {
    if (1) { }
  }

}
