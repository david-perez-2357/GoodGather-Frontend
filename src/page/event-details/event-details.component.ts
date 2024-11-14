import {Component, Renderer2, OnInit, OnDestroy, Input} from '@angular/core';
import {CardModule} from 'primeng/card';
import {BuyTicketButtonComponent} from '../../component/buy-ticket-button/buy-ticket-button.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {putDefaultBackground, removeDefaultBackground} from '../../method/background-methods';
import Event from '../../interface/Event';
import {convertSecondsToString} from '../../method/date-methods';

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
  event: Event = {
    id: 0,
    name: 'Event Name',
    description: 'Event Description',
    image: 'https://hips.hearstapps.com/hmg-prod/images/calendario-carreras-populares-running-sevilla-2023-1669049504.jpg',
    start_date: '2023-01-23 00:00:00',
    end_date: '2024-01-30 13:00:00',
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

  constructor(private renderer: Renderer2) {}

  calculateTicketPercentage() {
    return (this.event.bought_tickets / this.event.capacity) * 100;
  }

  getDateRange() {
    const startDate = new Date(this.event.start_date);
    const endDate = new Date(this.event.end_date);

    const formattedStartDate = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
    const formattedEndDate = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;

    const startHour = startDate.getHours() < 10 ? `0${startDate.getHours()}` : startDate.getHours();
    const startMinute = startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes();

    const endHour = endDate.getHours() < 10 ? `0${endDate.getHours()}` : endDate.getHours();
    const endMinute = endDate.getMinutes() < 10 ? `0${endDate.getMinutes()}` : endDate.getMinutes();

    if (startDate.getDate() === endDate.getDate()) {
      // Si estan en el mismo dia poner como 12/12/2023 00:00 - 01:00
      return `${formattedStartDate} ${startHour}:${startMinute} - ${endHour}:${endMinute}`;
    } else if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear() && startDate.getFullYear() === new Date().getFullYear()) {
      // Si estan en el mismo mes y año, poner Del 12 de diciembre, 00:00, al 13 de diciembre, 01:00
      return `Del ${startDate.getDate()} de ${startDate.toLocaleString('es-ES', { month: 'long' })}, a las ${startHour}:${startMinute}, al ${endDate.getDate()} de ${endDate.toLocaleString('es-ES', { month: 'long' })}, a las ${endHour}:${endMinute}`;
    } else {
      // Si no poner Desde el 12/12/2023 a las 00:00 hasta el 13/12/2023 a las 01:00
      return `Desde el ${formattedStartDate} a las ${startHour}:${startMinute} hasta el ${formattedEndDate} a las ${endHour}:${endMinute}`;
    }
  }

  ngOnInit() {
    putDefaultBackground(this.renderer);
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }
}
