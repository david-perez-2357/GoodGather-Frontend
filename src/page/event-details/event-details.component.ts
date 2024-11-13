import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './event-details.component.html',
  styles: ``
})

export class EventDetailsComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(document.body, 'default-bg');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'default-bg');
  }
}
