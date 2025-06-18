import { Injectable } from '@angular/core';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(public user: UserService) { }
}
