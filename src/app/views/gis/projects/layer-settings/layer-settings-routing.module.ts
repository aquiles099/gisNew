import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayerSettingsComponent } from './layer-settings.component';

const routes: Routes = [
  {
    path: '',
    component: LayerSettingsComponent,
  },
  {
    path: '**',
    component: LayerSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayerSettingsRoutingModule { }
