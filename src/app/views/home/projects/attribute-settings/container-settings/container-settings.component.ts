import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import { Project } from '../../../../../interfaces/project';
import { ProjectAccessService } from '../../../../../services/administration/project-access.service';

@Component({
  selector: 'app-container-settings',
  templateUrl: './container-settings.component.html',
  styleUrls: [
    './container-settings.component.scss',
    '../../../../../../styles/home/view.scss'
  ]
})
export class ContainerSettingsComponent implements OnInit {

  private routeDataSubscription:Subscription;

  public project:Project;

  constructor(
    private route:ActivatedRoute,
    protected _projectAccessService:ProjectAccessService,
  ) { }

  ngOnInit(): void {
    this.routeDataSubscription = this.route.data.subscribe(data => {
      
      this.project = data['project'];
      console.log(this.project);

    });
  }

}
