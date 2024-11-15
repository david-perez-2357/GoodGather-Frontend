import {Component, Renderer2, OnInit, OnDestroy, Input} from '@angular/core';
import {CardModule} from 'primeng/card';
import {BuyTicketButtonComponent} from '../../component/buy-ticket-button/buy-ticket-button.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {putDefaultBackground, removeDefaultBackground} from '../../method/background-methods';
import Event from '../../interface/Event';
import {EventService} from '../../service/EventService';
import { HttpClientModule } from '@angular/common/http';
import moment from 'moment';
import {SkeletonModule} from 'primeng/skeleton';
import {NgIf} from '@angular/common';
import {callAPI} from '../../method/response-mehods';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import ApiResponse from '../../interface/ApiResponse';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CardModule,
    BuyTicketButtonComponent,
    ProgressBarModule,
    HttpClientModule,
    SkeletonModule,
    NgIf,
    ToastModule,
  ],
  templateUrl: './event-details.component.html',
  styles: ``,
  providers: [MessageService]
})

export class EventDetailsComponent implements OnInit, OnDestroy {
  eventLoaded: boolean = false;
  event: Event = {
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

  constructor(private renderer: Renderer2, private eventService: EventService, private messageService: MessageService) { }

  calculateTicketPercentage() {
    return (this.event.boughtTickets / this.event.capacity) * 100;
  }

  getDateRange(): string {
    // Convierte las fechas usando Moment.js, especificando el formato de entrada
    const startDate = moment(this.event.startDate, "YYYY-MM-DD HH:mm");
    const endDate = moment(this.event.endDate, "YYYY-MM-DD HH:mm");

    console.log('startDate:', this.event.startDate);

    // Usa Moment.js para el formateo de fecha y hora
    const formattedStartDate = startDate.format("DD/MM/YYYY");
    const formattedEndDate = endDate.format("DD/MM/YYYY");

    const startHour = startDate.format("HH:mm");
    const endHour = endDate.format("HH:mm");

    if (startDate.isSame(endDate, 'day')) {
      // Si están en el mismo día, muestra como: 12/12/2023 00:00 - 01:00
      return `${formattedStartDate} ${startHour} - ${endHour}`;
    } else if (startDate.isSame(endDate, 'month') && startDate.isSame(endDate, 'year') && startDate.isSame(moment(), 'year')) {
      // Si están en el mismo mes y año, muestra como: Del 12 de diciembre, 00:00, al 13 de diciembre, 01:00
      return `Del ${startDate.date()} de ${startDate.format("MMMM")}, a las ${startHour}, al ${endDate.date()} de ${endDate.format("MMMM")}, a las ${endHour}`;
    } else {
      // En otros casos, muestra como: Desde el 12/12/2023 a las 00:00 hasta el 13/12/2023 a las 01:00
      return `Desde el ${formattedStartDate} a las ${startHour} hasta el ${formattedEndDate} a las ${endHour}`;
    }
  }

  getEvent(response: ApiResponse): void {
    console.log('response:', response);
    if (response.status === 200) {
      this.event = response.data;
      this.eventLoaded = true;
    } else if (response.toastMessage) {
      console.log('mesageService:', this.messageService);
      this.messageService.add(response.toastMessage);
    }
  }

  ngOnInit() {
    putDefaultBackground(this.renderer);
    callAPI(this.eventService.getEvent(1)).then((response) => this.getEvent(response));
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }
}
