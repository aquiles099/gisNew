import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GisLayer } from '../../../../../../../models/gis-layer';
import { MapLayerService } from '../../../../../../../services/gis/map/map-layer.service';
import { ToolService } from '@services/gis/map/tool.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit
{
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  @Input()
  public layerId:number;

  @Input()
  public label:string = null;
  
  @Input()
  public disabled:boolean = false;

  @Output()
  public change:EventEmitter<GisLayer> = new EventEmitter;

  public layers:GisLayer[] = [];

  constructor(
    private _mapLayerService:MapLayerService,
    private toolService: ToolService
  ) { }

  ngOnInit(): void {
    this.toolService.clearSelectLayer.subscribe((res: any) => {
      if(res){
        this.ngSelectComponent.clearModel();
      }
    });
    this.layers = this._mapLayerService.projectedLayers;
  }

  public onChange(layer:GisLayer):void
  {
    this.change.emit(layer);
  }


}
