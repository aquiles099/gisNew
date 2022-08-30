import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

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
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  private routeDataSubscription:Subscription;

  public showSpinner:boolean = false;

  public records: any[] = [];

  constructor(
    protected _projectService:ProjectService,
    private _changeDetectorRef:ChangeDetectorRef
  ) {
    super(_projectService);
    
    this.startCallback = () => this.showSpinner = true;
    
    this.endCallback = () => this.showSpinner = false;
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit():void
  {
    this.loadRecords();
  }

  public async loadRecords(): Promise<void>
  {
    await super.loadRecords();
  }

  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void 
  {
   this.routeDataSubscription.unsubscribe(); 
  }

}
