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
import {NgIf} from '@angular/common';
import {TicketService} from '@/service/TicketService';
import {callAPI} from '@/method/response-mehods';
import {EventService} from '@/service/EventService';
import moment from 'moment';
import {getCurrentUser} from '@/method/app-user-methods';
import {SpinnerModule} from 'primeng/spinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AppService} from '@/service/AppService';
import {Button} from 'primeng/button';

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
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit, OnDestroy {
  usersBoughtTickets: Ticket[] = [];
  events: Event[] = [];
  ticketsLoaded = false;

  constructor(private renderer: Renderer2,
              private ticketService: TicketService,
              private eventService: EventService,
              private appService: AppService
  ) { }

  ngOnInit() {
    putDefaultBackground(this.renderer);

    Promise.all([
      callAPI(this.ticketService.getTicketsBoughtByActiveUser()),
      callAPI(this.eventService.getAllEvents())
    ]).then(([tickets, events]) => {
      this.usersBoughtTickets = tickets.data;
      this.events = events.data;
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

  protected readonly moment = moment;

  returnEventStatus(eventId: any): number {
    const event = this.getEvent(eventId);
    console.log(event);
    if (!event.id) {
      return 0;
    }

    const eventStartDate = moment(event.startDate);
    const eventEndDate = moment(event.endDate);
    const now = moment();

    if (now.isBefore(eventStartDate)) {
      return 3;
    }else if (now.isAfter(eventEndDate)) {
      return 1
    }else {
      return 2;
    }
  }

  protected readonly getCurrentUser = getCurrentUser;
}
