import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayerSettingsRoutingModule } from './layer-settings-routing.module';
import { LayerSettingsComponent } from './layer-settings.component';


@NgModule({
  declarations: [
    LayerSettingsComponent
  ],
  imports: [
    CommonModule,
    LayerSettingsRoutingModule
  ]
})
export class LayerSettingsModule { }
