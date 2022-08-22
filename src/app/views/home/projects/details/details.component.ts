import { Component, OnInit } from '@angular/core';
import { RequestedProjectService } from '../../../../services/requested-project.service';
import { Project } from '../../../../interfaces/project';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public project:Project;

  constructor(
    private _requestedProjectService:RequestedProjectService
  ) { }

  ngOnInit(): void 
  {
    this.project = this._requestedProjectService.project;
  }

}
