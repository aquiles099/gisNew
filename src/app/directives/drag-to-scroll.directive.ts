import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[dragToScroll]'
})
export class DragToScrollDirective {
  
  private element:HTMLElement;
  private pos = { top: 0, left: 0, x: 0, y: 0 };
  private mouseDown:boolean;

  constructor(private el: ElementRef)
  {
    this.element = el.nativeElement;
  }
  
  @HostListener('mousedown', ['$event']) onMouseDown(event)
  {
    this.mouseDown = true;
    this.element.style.cursor = 'grabbing';
    this.element.style.userSelect = 'none';

    Object.assign(this.pos, {
      left: this.element.scrollLeft,
      top: this.element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    });
  }
 
  @HostListener('mousemove', ['$event']) mouseMoveHandler(event)
  {
    if(this.mouseDown)
    {
      // How far the mouse has been moved
      const dx = event.clientX - this.pos.x;
      const dy = event.clientY - this.pos.y;

      // Scroll the element
      this.element.scrollTop = this.pos.top - dy;
      this.element.scrollLeft = this.pos.left - dx;
    }
  }

  @HostListener('mouseup', ['$event']) mouseUpHandler()
  {
    this.element.style.cursor = 'grab';
    this.element.style.removeProperty('user-select');
    this.mouseDown = false;
  }
}
