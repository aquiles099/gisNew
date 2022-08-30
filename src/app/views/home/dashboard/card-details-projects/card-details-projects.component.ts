import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-card-details-projects',
  templateUrl: './card-details-projects.component.html',
  styleUrls: ['./card-details-projects.component.scss']
})
export class CardDetailsProjectsComponent implements OnInit {

  @Input() public detailsProject: boolean = false;

  constructor(
    private _authService:AuthService,
  ) { }

  get user():User
  {
    return this._authService.authUserService.user;
  }

  ngOnInit(): void {
  }

}
