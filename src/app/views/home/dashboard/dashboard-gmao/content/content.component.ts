import { Component, OnInit, AfterViewInit, ChangeDetectorRef,
  AfterViewChecked, ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { VirtualScrollWithPaginatorComponent } from '@shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';
import { ProjectService } from '@services/administration/project.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: [
    './content.component.scss',
    '../../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent extends VirtualScrollWithPaginatorComponent
  implements OnInit, AfterViewInit, AfterViewChecked {

  @Output() incidentSelected: EventEmitter<any> = new EventEmitter;

  public showSpinner:boolean = false;
  public optionProyect: any;

  public records: any[] = [];
  public optionsFilter: any[] = [];

  constructor(
    protected _projectService:ProjectService,
    private _changeDetectorRef:ChangeDetectorRef
  ) {
    super(null);
  }

  ngOnInit(): void {
  }

  public async ngAfterViewInit():Promise<void>
  {
    await this.loadRecords();
  }

  public async loadRecords(): Promise<void>
  {
    this.records = [
      {
        name: 'Incidencia 50',
        lapse: 'Desde 01/08/2022 hasta 27/08/2022',
      },
      {
        name: 'O. de Trabajo 30',
        lapse: 'Desde 01/08/2022 hasta 27/08/2022',
      },
      {
        name: 'Mant. Prevent. 50',
        lapse: 'Desde 01/08/2022 hasta 27/08/2022',
      }
    ];
    this.optionsFilter = await this._projectService.getSimpleList();
    this.optionProyect = this.optionsFilter[0];
    
  }

  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

  public selectedIncident(data: any): void {
    this.incidentSelected.emit(data);
  }

}
