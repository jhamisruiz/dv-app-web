/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppStore } from '@app/shared/common/interfaces/store';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';

export interface Activity {
  time: number;
  componentid: string;
  id: unknown;
  path?: string;
  type: string;
  transaction_id: string;
  userid: number | string;
  componentName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  getLog(transactionId: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  currentPage = 0;
  pageLength = 10;

  public get isLoading(): Observable<any> {
    return this.behaviorIsLoading.asObservable();
  }

  public get activities(): Observable<Record<string, any>[]> {
    return this.behaviorActivities.asObservable();
  }

  private behaviorIsLoading = new BehaviorSubject(false);
  private behaviorActivities = new BehaviorSubject<Activity[]>([]);

  constructor(
    private ws: WebsocketService,
    private http: HttpClient,
    private store: Store<AppStore>,
  ) { }

  parseTime(timeAgo: any): string {
    return moment(new Date(timeAgo)).fromNow();
  }

  addActivity(activity: Activity): void {
    const activities = this.behaviorActivities.getValue();


  }

  syncActivities(): void {

    // this.loadActivities()
    //   .pipe(
    //     map(arr => {
    //       console.log({ arr });
    //       return arr;
    //     })
    //   )
    //   .subscribe(data => {
    //     this.behaviorActivities.next(data.sort((a: Activity, b: Activity) => a.time - b.time));
    //   });
  }

}
