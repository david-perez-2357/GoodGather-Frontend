import { Component, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { Button, ButtonDirective } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule } from 'primeng/paginator';
import { Ripple } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EventService } from '../../service/EventService';
import { callAPI } from '../../method/response-mehods';
import ApiResponse from '../../interface/ApiResponse';
import Event from '../../interface/Event';
import { EventComponent } from '../../component/event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { CauseComponent } from '../../component/cause/cause.component';
import { CauseService } from '../../service/CauseService';
import Cause from '../../interface/Cause';

@Component({
  selector: 'app-page-index',
  standalone: true,
  imports: [
    FloatLabelModule,
    FormsModule,
    ChipsModule,
    Button,
    IconFieldModule,
    InputIconModule,
    OverlayPanelModule,
    CheckboxModule,
    NgForOf,
    ButtonDirective,
    SelectButtonModule,
    SliderModule,
    PaginatorModule,
    Ripple,
    ToastModule,
    HttpClientModule,
    EventComponent,
    CauseComponent,
    NgIf,
  ],
  templateUrl: './view-all-events.component.html',
  styleUrls: ['./view-all-events.component.css'],
  providers: [MessageService],
})
export class ViewAllEventsComponent implements OnInit, OnDestroy {
  @ViewChild('overlay') overlay!: OverlayPanel;

  events: Event[] = [];
  causes: Cause[] = [];
  paginatedEvents: Event[] = [];
  paginatedCauses: Cause[] = [];
  loading = false;
  stateOptions: any[] = [
    { label: 'En tu país', value: 'country' },
    { label: 'En tu provincia', value: 'province' },
  ];
  value: string = 'province';
  valueslider: number = 50;
  groupedEvents: { [causeId: number]: Event[] } = {};

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private renderer: Renderer2,
    private eventService: EventService,
    private causeService: CauseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'default-bg');

    Promise.all([
      callAPI(this.causeService.getAllCauses()),
      callAPI(this.eventService.getAllEvents())
    ]).then(([causesResponse, eventsResponse]) => {
      if (causesResponse.status === 200) {
        this.causes = causesResponse.data;
      } else if (causesResponse.toastMessage) {
        this.messageService.add(causesResponse.toastMessage);
      }

      if (eventsResponse.status === 200) {
        this.events = eventsResponse.data;
      } else if (eventsResponse.toastMessage) {
        this.messageService.add(eventsResponse.toastMessage);
      }

      this.totalRecords = this.events.length;
      this.updatePaginatedCauses();
    });
  }


  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'default-bg');
  }

  updatePaginatedCauses(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
    this.groupedEvents = {};
    console.log(this.causes);

    this.groupedEvents = this.groupEventsByCause(this.paginatedEvents, this.causes);
    this.paginatedCauses = this.getUsedCauses(this.paginatedEvents);
  }

  getUsedCauses(events: Event[]): Cause[] {
    const usedCauses: Cause[] = [];
    events.forEach((event) => {
      const cause = this.causes.find((cause) => cause.id === event.idCause);
      if (cause && !usedCauses.includes(cause)) {
        usedCauses.push(cause);
      }
    });
    return usedCauses;
  }

  groupEventsByCause(events: Event[], causes: Cause[]): { [causeId: number]: Event[] } {
    const groupedEvents: { [causeId: number]: Event[] } = {};
    causes.forEach((cause) => {
      groupedEvents[cause.id] = events.filter((event) => event.idCause === cause.id);
    });
    return groupedEvents;
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;

    this.updatePaginatedCauses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  load(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  toggleOverlay(event: MouseEvent): void {
    this.overlay.toggle(event);
  }
}
