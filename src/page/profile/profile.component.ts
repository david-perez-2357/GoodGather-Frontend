import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';
import {AvatarModule} from "primeng/avatar";
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {FormsModule} from '@angular/forms';
import Event from '@/interface/Event';
import Ticket from '@/interface/Ticket';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {TicketService} from '@/service/TicketService';
import {callAPI} from '@/method/response-mehods';
import {EventService} from '@/service/EventService';
import moment from 'moment';
import {SpinnerModule} from 'primeng/spinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AppService} from '@/service/AppService';
import {Button} from 'primeng/button';
import {EventComponent} from '@/component/event/event.component';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CauseService} from '@/service/CauseService';
import Cause from '@/interface/Cause';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import AppUser from '@/interface/AppUser';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarModule,
    TabViewModule,
    TagModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    RouterLink,
    NgIf,
    SpinnerModule,
    ProgressSpinnerModule,
    Button,
    EventComponent,
    NgForOf,
    ToastModule,
    PaginatorModule,
  ],
  templateUrl: './profile.component.html',
  styles: ``,
  providers: [MessageService]
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected readonly moment = moment;

  usersBoughtTickets: Ticket[] = [];
  events: Event[] = [];
  causes: Cause[] = [];
  eventsCreatedByUser: Event[] = [];
  paginatedEventsCreatedByUser: Event[] = [];
  ticketsLoaded = false;
  userAssistedEvents = 0;
  userUpcomingEvents = 0;
  userTotalContributions = 0;

  first: number = 0;
  rows: number = 5;
  activeUser: AppUser = {} as AppUser;

  constructor(private renderer: Renderer2,
              private ticketService: TicketService,
              private eventService: EventService,
              private appService: AppService,
              private messageService: MessageService,
              private causeService: CauseService
  ) { }

  ngOnInit() {
    putDefaultBackground(this.renderer);
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });

    Promise.all([
      callAPI(this.ticketService.getTicketsBoughtByActiveUser(this.activeUser)),
      callAPI(this.eventService.getAllEventsWithoutFilters()),
      callAPI(this.causeService.getAllCauses())
    ]).then(([tickets, events, causes]) => {
      this.usersBoughtTickets = tickets?.data;
      this.events = events.data;
      this.causes = causes.data;
      this.eventsCreatedByUser = this.getEventsCreatedByUser(this.events);
      this.paginatedEventsCreatedByUser = this.eventsCreatedByUser.slice(this.first, this.first + this.rows);

      this.userAssistedEvents = this.getUserNumOfAssistedEvents();
      this.userUpcomingEvents = this.getUserNumOfUpcomingEvents();
      this.userTotalContributions = this.getUserTotalContributions();
      this.ticketsLoaded = true;
    }).catch((error) => {
      this.ticketsLoaded = true;
      this.appService.showWErrorInApp(error);
    });
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  getEvent(idEvent: number): Event {
    const event = this.events.find(event => event.id === idEvent);
    return event ?? {} as Event;
  }

  getCause(idCause: number): Cause {
    const cause = this.causes.find(cause => cause.id === idCause);
    return cause ?? {} as Cause;
  }

  getEventsCreatedByUser(events: Event[]): Event[] {
    return events.filter(event => event.idOwner === this.activeUser.id);
  }

  getUserDistinctEvents(): Event[] {
    const events: Set<Event> = new Set();
    this.usersBoughtTickets.forEach(ticket => {
      events.add(this.getEvent(ticket.idEvent));
    });
    return Array.from(events);
  }

  getUserNumOfAssistedEvents(): number {
    return this.getUserDistinctEvents().filter((event) => {
      return moment(event.endDate).isBefore(moment());
    }).length;
  }

  getUserNumOfUpcomingEvents(): number {
    return this.getUserDistinctEvents().filter((event) => {
      return moment(event.startDate).isAfter(moment());
    }).length;
  }

  getUserTotalContributions(): number {
    return this.usersBoughtTickets.reduce((acc, ticket) => {
      return acc + ticket.price;
    }, 0);
  }

  returnEventStatus(eventId: any): number {
    const event = this.getEvent(eventId);
    if (!event.id) {
      return 0;
    }

    const eventStartDate = moment(event.startDate);
    const eventEndDate = moment(event.endDate);
    const now = moment();

    if (eventStartDate.isAfter(now)) {
      return 1;
    }else if (eventEndDate.isAfter(now)) {
      return 3;
    }else {
      return 2;
    }
  }

  showInfoTicketButtonMessage() {
    this.messageService.add({severity: 'info', summary: 'Info', detail: 'No se puede comprar un ticket aquí'});
  }

  calculatePercentage(value: number, total: number): number {
    return Math.round((value / total) * 100);
  }

  /**
   * Obtiene la posición de un evento basado en la recaudación total de los eventos asociados a la misma causa.
   * @param event - El evento cuya posición se desea calcular.
   * @returns La posición del evento basado en la recaudación, con posiciones únicas.
   */
  getEventFundPositionOnCause(event: Event): number {
    // Filtrar eventos relacionados con la misma causa
    const eventsOfSameCause = this.events.filter(e => e.idCause === event.idCause);

    // Crear una lista de objetos con recaudación y criterio de desempate
    const eventsWithFunds = eventsOfSameCause.map(e => ({
      id: e.id,
      fund: e.boughtTickets * e.ticketPrice,
    }));

    // Ordenar eventos primero por recaudación y luego por ID para desempatar
    eventsWithFunds.sort((a, b) => {
      if (b.fund !== a.fund) {
        return b.fund - a.fund; // Ordenar por recaudación de mayor a menor
      }
      return a.id - b.id; // Desempatar por ID (orden ascendente)
    });

    // Buscar la posición del evento actual en la lista ordenada
    return eventsWithFunds.findIndex(e => e.id === event.id) + 1; // Retornar la posición basada en el índice (1-based)
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;

    this.paginatedEventsCreatedByUser = this.eventsCreatedByUser.slice(this.first, this.first + this.rows);
  }
}
