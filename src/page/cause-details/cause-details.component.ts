import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CauseService} from '@/service/CauseService';
import {EventService} from '@/service/EventService';
import Cause from '@/interface/Cause';
import {ActivatedRoute} from '@angular/router';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '@/interface/ApiResponse';
import {AppService} from '@/service/AppService';
import {NgClass, NgForOf} from '@angular/common';
import {EventComponent} from '@/component/event/event.component';
import Event from '@/interface/Event';
import {PaginatorModule} from 'primeng/paginator';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [
    NgForOf,
    EventComponent,
    NgClass,
    PaginatorModule
  ],
  templateUrl: './cause-details.component.html',
  styleUrls: ['./cause-details.component.css']
})
export class CauseDetailsComponent implements OnInit, OnDestroy{
  constructor(private renderer: Renderer2,
              private causeService: CauseService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService) {
  }

  causeId: number = 1
  cause: Cause = {} as Cause;
  events: Event[] = []

  totalfunds: number = 0;
  totalEvents: number = 0;
  totalDonors: number = 0;

  activeFilter: string | null = null;

  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  visibleEvents: Event[] = [];


  setCause(response: ApiResponse): void {
    if (response.status === 200) {
      this.cause = response.data;
    }else {
      this.catchErrorMessage(response);
    }
  }

  loadEvents(): void {
    callAPI(this.causeService.getAllEventsFromCause(this.causeId))
      .then((eventsResponse: ApiResponse) => {
        this.events = eventsResponse.data;
        this.totalRecords = this.events.length;
        this.applyFilters();
        this.updateVisibleEvents();
        this.getDataCause();
      })
      .catch((error) => {
        this.catchErrorMessage(error);
      });
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }

  catchErrorMessage(error: any): void {
    this.appService.showWErrorInApp(error);
  }

  ngOnInit() {
    this.causeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvents();
    putDefaultBackground(this.renderer);
    callAPI(this.causeService.getCause(this.causeId))
      .then((causeResponse: ApiResponse) => {
        this.setCause(causeResponse);
      })
      .catch((error) => {
        this.catchErrorMessage(error);
      });
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  getDataCause(): void {
    this.totalEvents = this.events.length;
    this.totalDonors = this.events.reduce((total, event) => {
      return total + (event.boughtTickets || 0);
    }, 0);
    this.totalfunds = this.events.reduce((total, event) => {
      return total + (event.boughtTickets * event.ticketPrice);
    }, 0);
  }

  applyFilters(): void {
    let filteredEvents = [...this.events];

    // Aplica el filtro activo
    if (this.activeFilter === 'cheapest') {
      filteredEvents = filteredEvents.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
    } else if (this.activeFilter === 'popular') {
      filteredEvents = filteredEvents.sort((a, b) => (b.boughtTickets || 0) - (a.boughtTickets || 0));
    } else if (this.activeFilter === 'recent') {
      filteredEvents = filteredEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }

    this.events = filteredEvents;
    this.totalRecords = this.events.length;
    this.updateVisibleEvents();
  }

  updateVisibleEvents(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.visibleEvents = this.events.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updateVisibleEvents();
  }

  onCheapestClick(): void {
    this.activeFilter = this.activeFilter === 'cheapest' ? null : 'cheapest';
    this.applyFilters();
  }

  onPopularClick(): void {
    this.activeFilter = this.activeFilter === 'popular' ? null : 'popular';
    this.applyFilters();
  }

  onRecentClick(): void {
    this.activeFilter = this.activeFilter === 'recent' ? null : 'recent';
    this.applyFilters();
  }


}
