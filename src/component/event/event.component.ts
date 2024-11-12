import { Component } from '@angular/core';
import {IconFieldModule} from 'primeng/iconfield';
import {ProgressBarModule} from 'primeng/progressbar';
import {Button} from 'primeng/button';
import {Input} from '@angular/core';
import Event from '../../interface/Event';
import {convertSecondsToString} from '../../method/date-methods';
import {BuyTicketButtonComponent} from "../buy-ticket-button/buy-ticket-button.component";

@Component({
  selector: 'app-event',
  standalone: true,
    imports: [
        IconFieldModule,
        ProgressBarModule,
        Button,
        BuyTicketButtonComponent
    ],
  templateUrl: './event.component.html',
  styles: ``
})

export class EventComponent {
  @Input() event: Event = {
    id: 0,
    name: 'Event Name',
    description: 'Event Description',
    image: 'https://hips.hearstapps.com/hmg-prod/images/calendario-carreras-populares-running-sevilla-2023-1669049504.jpg',
    start_date: new Date('2023-01-01 00:00:00'),
    end_date: new Date('2023-01-01 01:00:00'),
    capacity: 100,
    bought_tickets: 25,
    address: 'The Address',
    province: 'The Province',
    country: 'The Country',
    ticket_price: 0,
    deleted: 0,
    id_owner: 0,
    id_cause: 0
  }

  calculateTicketPercentage() {
    return (this.event.bought_tickets / this.event.capacity) * 100;
  }

  showStartDateDiff() {
    const diff = new Date().getTime() - this.event.start_date.getTime();
    return convertSecondsToString(diff / 1000);
  }
}
