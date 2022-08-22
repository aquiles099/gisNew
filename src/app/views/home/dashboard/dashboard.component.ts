import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _authService:AuthService
  ) { }

  ngOnInit(): void {
  }

  public logout():void
  {
    this._authService.logout();
  }
}
