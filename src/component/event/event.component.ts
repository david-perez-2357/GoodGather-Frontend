import { Component } from '@angular/core';
import {IconFieldModule} from 'primeng/iconfield';
import {ProgressBarModule} from 'primeng/progressbar';
import {Button} from 'primeng/button';
import {Input} from '@angular/core';
import Event from '@/interface/Event';
import {convertSecondsToString} from '@/method/date-methods';
import {BuyTicketButtonComponent} from "@/component/buy-ticket-button/buy-ticket-button.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    IconFieldModule,
    ProgressBarModule,
    Button,
    BuyTicketButtonComponent,
    RouterLink
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
    startDate: '2023-01-23 00:00:00',
    endDate: '2024-01-30 13:00:00',
    capacity: 100,
    boughtTickets: 25,
    address: 'The Address',
    province: 'The Province',
    country: 'The Country',
    ticketPrice: 0,
    deleted: 0,
    idOwner: 0,
    idCause: 0
  }

  calculateTicketPercentage() {
    return (this.event.boughtTickets / this.event.capacity) * 100;
  }

  showStartDateDiff() {
    const diff = new Date().getTime() - new Date(this.event.startDate).getTime();
    return convertSecondsToString(diff / 1000);
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }
}
