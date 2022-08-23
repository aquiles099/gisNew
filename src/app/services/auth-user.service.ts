import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { User as UserInterface} from '../interfaces/user';

@Injectable({
  providedIn: "root"
})
export class AuthUserService
{
  private userSubject:BehaviorSubject<User>;
  public userObservable:Observable<User>;

  constructor()
  {
    this.userSubject = new BehaviorSubject((null as any));
    this.userObservable = this.userSubject.asObservable();
    this.initiate();
  }

  private initiate():void
  {
    if( localStorage.getItem("user") )
    {
      const user = new User(JSON.parse(localStorage.getItem("user")));
      this.userSubject.next(user);
    }
  }

  get user():User
  {
    return this.userSubject.getValue();
  }

  public next(data:UserInterface|null):void
  {  
    if(data)
    {
      const user = new User(data);
      this.userSubject.next(user);
    }
    else
    {
      this.userSubject.next((null as any));
    }
  }

  public clear():void
  {
    this.next(null);
  }
}
