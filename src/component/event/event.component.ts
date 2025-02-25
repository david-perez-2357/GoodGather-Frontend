import {Component, EventEmitter, Output} from '@angular/core';
import {IconFieldModule} from 'primeng/iconfield';
import {ProgressBarModule} from 'primeng/progressbar';
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
    BuyTicketButtonComponent,
    RouterLink,
  ],
  templateUrl: './event.component.html',
  styles: ``
})

export class EventComponent {
  @Output() onBuyButtonClicked = new EventEmitter<Event>();
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

  /**
   * Calcula el porcentaje de entradas vendidas
   * @returns number
   */
  calculateTicketPercentage() {
    return (this.event.boughtTickets / this.event.capacity) * 100;
  }

  /**
   * Calcula la diferencia de tiempo entre la fecha de inicio del evento y la fecha actual y la muestra en formato legible
   * @returns string
   */
  showStartDateDiff() {
    const diff = new Date(this.event.startDate).getTime() - new Date().getTime();
    if (diff < 0) {
      return 'En curso';
    }
    return 'Dentro de ' + convertSecondsToString(diff / 1000);
  }

  /**
   * Si la imagen del evento no se puede cargar, se muestra una imagen de error
   * @returns void
   */
  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }
}
