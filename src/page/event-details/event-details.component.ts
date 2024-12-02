import {Component, Renderer2, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {CardModule} from 'primeng/card';
import {BuyTicketButtonComponent} from '@/component/buy-ticket-button/buy-ticket-button.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';
import Event from '@/interface/Event';
import {EventService} from '@/service/EventService';
import {TicketService} from '@/service/TicketService';
import { HttpClientModule } from '@angular/common/http';
import moment from 'moment';
import {SkeletonModule} from 'primeng/skeleton';
import {NgIf} from '@angular/common';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '@/interface/ApiResponse';
import {AppService} from '@/service/AppService';
import {ActivatedRoute} from '@angular/router';
import "moment/locale/es";
import {CauseComponent} from '@/component/cause/cause.component';
import {CauseService} from '@/service/CauseService';
import Cause from '@/interface/Cause';
import {BuyTicketDialogComponent} from '@/component/buy-ticket-dialog/buy-ticket-dialog.component';
import {getCurrentUser, userIsLoggedIn} from '@/method/app-user-methods';

moment.locale("es");

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
    CauseComponent,
    BuyTicketDialogComponent,
  ],
  templateUrl: './event-details.component.html',
  styles: ``
})

export class EventDetailsComponent implements OnInit, OnDestroy {
  contentLoaded: boolean = false;
  buyTicketDialogVisible: boolean = false;

  eventId: number = 1;
  event: Event = {} as Event;

  cause: Cause = {} as Cause;
  causeFunds: number = 0;

  ticketsBoughtInLast24h: number = 0;

  constructor(private renderer: Renderer2,
              private eventService: EventService,
              private ticketService: TicketService,
              private appService: AppService,
              private causeService: CauseService,
              private route: ActivatedRoute) { }

  @ViewChild(BuyTicketDialogComponent) child!: BuyTicketDialogComponent;

  showBuyTicketDialog() {
    this.child.showDialog();
    this.buyTicketDialogVisible = true;
  }

  calculateTicketPercentage() {
    return (this.event.boughtTickets / this.event.capacity) * 100;
  }

  getDateRange(): string {
    // Convierte las fechas usando Moment.js, especificando el formato de entrada
    const startDate = moment(this.event.startDate, "YYYY-MM-DD HH:mm");
    const endDate = moment(this.event.endDate, "YYYY-MM-DD HH:mm");

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

  setEvent(response: ApiResponse): void {
    if (response.status === 200) {
      this.event = response.data;
    }else {
      this.catchErrorMessage(response);
    }
  }

  catchErrorMessage(error: any): void {
    this.appService.showWErrorInApp(error);
  }

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    putDefaultBackground(this.renderer);
    callAPI(this.eventService.getEvent(this.eventId))
      .then((eventResponse: ApiResponse) => {
        this.setEvent(eventResponse);
        this.event.boughtTickets = eventResponse.data?.boughtTickets ?? 0;

        return Promise.all([
          callAPI(this.ticketService.getTicketsBoughtInLast24h(this.eventId)),
          callAPI(this.causeService.getCause(this.event.idCause)),
          callAPI(this.causeService.getCauseFunds(this.event.idCause))
        ])
      }).then(([ticketsBoughtInLast24hResponse, causeResponse, causeFundsResponse]: ApiResponse[]) => {
        this.ticketsBoughtInLast24h = ticketsBoughtInLast24hResponse.data ?? 0;
        this.cause = causeResponse.data;
        this.causeFunds = causeFundsResponse.data ?? 0;
        this.contentLoaded = true;
      }).catch((error) => {
        this.catchErrorMessage(error);
      });
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }

  isEventFinished() {
    return moment().isAfter(this.event.endDate);
  }

  isEventHappening() {
    return moment().isBetween(this.event.startDate, this.event.endDate);
  }
}
