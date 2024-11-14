import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import {CardModule} from 'primeng/card';
import {BuyTicketButtonComponent} from '../../component/buy-ticket-button/buy-ticket-button.component';
import {ProgressBarModule} from 'primeng/progressbar';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CardModule,
    BuyTicketButtonComponent,
    ProgressBarModule
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
