import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { VirtualScrollWithPaginatorComponent } from '../../../../shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-dashboard-gmao',
  templateUrl: './dashboard-gmao.component.html',
  styleUrls: [
    './dashboard-gmao.component.scss',
    '../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardGmaoComponent  implements OnInit {

  public showSpinner:boolean = false;

  public records: any[] = [1,2,3];

  constructor(private _authService:AuthService) {
    
  }

  get user():User
  {
    return this._authService.authUserService.user;
  }

  ngOnInit(): void {
    console.log(this.user);
    
  }

  onSelect(item: any): void {
  }

  backToTheListing(): void {
  }


}
