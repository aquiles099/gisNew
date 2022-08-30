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
    this.records = [1,2,3];
    this.optionsFilter = await this._projectService.getListOptions();
    console.log(this.optionsFilter)
  }

  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

  public selectedIncident(): void {
    this.incidentSelected.emit(true);
  }

}
