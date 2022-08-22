import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ResourceService } from './services/resource.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { MatchValuePipe } from './pipes/match-value.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';


// components
import { VirtualScrollWithPaginatorComponent } from './components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { KeyMatchPipe } from './pipes/key-match.pipe';

@NgModule({
  declarations: [
    PaginationComponent,
    VirtualScrollWithPaginatorComponent,
    PaginatorComponent,
    //pipes
    MatchValuePipe,
    KeyMatchPipe,
    SafeHtmlPipe,
    PaginatorComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      preventDuplicates: true,
      enableHtml: true
    }),
    MatProgressSpinnerModule
  ],
  exports:[
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    PaginationComponent,
    MatProgressSpinnerModule,
    //
    VirtualScrollWithPaginatorComponent,
    PaginatorComponent,
    //
    SafeHtmlPipe,
    MatchValuePipe,
    KeyMatchPipe
  ],
  providers:[
    ResourceService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
