import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-card-details-projects',
  templateUrl: './card-details-projects.component.html',
  styleUrls: ['./card-details-projects.component.scss']
})
export class CardDetailsProjectsComponent implements OnInit {

  constructor(
    private _authService:AuthService,
  ) { }

  get user():User
  {
    return this._authService.authUserService.user;
  }

  ngOnInit(): void {
    console.log(this.user)
  }

}
