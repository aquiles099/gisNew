import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './analysis-charts.component.html',
  styleUrls: ['./analysis-charts.component.scss']
})
export class AnalysisChartsComponent extends BaseToolComponent implements OnInit {

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService
  )
  {
    super(
      toolService,
      mapService
    );

    this.key = "analysis-charts";
  }

  ngOnInit(): void {
  }

}
