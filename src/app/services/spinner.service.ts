import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { delayExecution } from '@shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public contentObservable:Observable<string>;
  public contentSubject:BehaviorSubject<string>;

  private _isVisible:boolean = false;
  
  private loopProcess:any;
  private htmlList:string[] = [];
  private currentHtml:string;
  
  private htmlVisibleTime:number = 1250;
  private htmlHiddenTime:number = 750;

  constructor(
    public spinner:NgxSpinnerService
  ) {
    this.contentSubject = new BehaviorSubject("");
    this.contentObservable = this.contentSubject.asObservable();
   }

   get content():string|string[]
   {
     return this.contentSubject.getValue();
   }
   
   get isVisible():boolean
   {
     return this._isVisible;
   }
   
   public show(content?:string|string[], name?:string, options?:Spinner):void
   {
    if( content )
      this.updateContent(content);

    this.spinner.show(name ?? "appSpinner", options);

    this._isVisible = true;
   }

   public hide(name?:string):void
   {
    if( this.isVisible )
    {
      this.spinner.hide(name ?? "appSpinner");
      
      this.clear();
      
      if(this.loopProcess)
      {
       this.loopProcess = null;
       this.htmlList = [];
       this.currentHtml = null;

       this._isVisible = false;
      }
    }
   }

   private updateContent(content:string|string[]):void
   {
      if( Array.isArray(content) )
        content = [...new Set([...content])];

      if( Array.isArray( content ) && content.length > 1 )
      {
        this.htmlList = content;

        this.loopProcess = async () => {
  
            const itemIndex = this.currentHtml ?
            this.htmlList.findIndex(html => html === this.currentHtml) + 1:
            0;
  
            const newContent = itemIndex <= (content.length - 1) ?
            content[itemIndex] :
            content[0];
    
            this.contentSubject.next(newContent);

            this.currentHtml = newContent;
            
            await delayExecution(this.htmlVisibleTime);
            
            this.clear();

            await delayExecution(this.htmlHiddenTime);

            if(this.loopProcess)
              this.loopProcess();
        };

        this.loopProcess();
      }
      else
      {
        const newContent = Array.isArray(content) ?
        content[0]:
        content;
  
        this.contentSubject.next(newContent);
      } 
  }

  private clear():void
  {
    this.contentSubject.next(null);
  }
}
