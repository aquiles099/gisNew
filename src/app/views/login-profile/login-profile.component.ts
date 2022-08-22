import { Component, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'login-profile',
  templateUrl: './login-profile.component.html',
  styleUrls: ['./login-profile.component.scss','../login/login.component.scss']
})
export class LoginProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input()
  user: any;
}
