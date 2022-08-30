import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';

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

  public showSpinner:boolean = false;

  public records: any[] = [];

  constructor(
    protected _projectService:ProjectService,
    private _changeDetectorRef:ChangeDetectorRef
  ) {
    super(null);
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit():void
  {
    this.loadRecords();
  }

  public async loadRecords(): Promise<void>
  {
    this.records = [1,2,3];
  }

  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

}
