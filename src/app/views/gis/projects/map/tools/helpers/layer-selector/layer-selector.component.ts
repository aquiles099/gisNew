import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { GisLayer } from '../../../../../../../models/gis-layer';
import { MapLayerService } from '../../../../../../../services/gis/map/map-layer.service';

@Component({
  selector: 'layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit
{
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
    private _mapLayerService:MapLayerService
  ) { }
  
  public ngOnInit(): void
  {
    this.layers = this._mapLayerService.projectedLayers;
  }

  public onChange(layer:GisLayer):void
  {
    this.change.emit(layer);
  }
}
