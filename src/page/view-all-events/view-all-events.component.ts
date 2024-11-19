import { Component, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForOf } from '@angular/common';
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
import {CauseComponent} from '../../component/cause/cause.component';

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
    CauseComponent
  ],
  templateUrl: './view-all-events.component.html',
  styleUrls: ['./view-all-events.component.css'],
  providers: [MessageService]
})
export class ViewAllEventsComponent implements OnInit, OnDestroy {
  @ViewChild('overlay') overlay!: OverlayPanel;

  events: Event[] = [];
  paginatedEvents: Event[] = [];
  loading = false;
  stateOptions: any[] = [{ label: 'En tu país', value: 'country' }, { label: 'En tu provincia', value: 'province' }];
  value: string = 'province';
  valueslider: number = 50;

  // Paginación
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(private renderer: Renderer2, private eventService: EventService, private messageService: MessageService) {}

  appendEvents(response: ApiResponse): void {
    console.log('response:', response);
    if (response.status === 200) {
      this.events = response.data;
      this.totalRecords = this.events.length;
      this.updatePaginatedEvents();
    } else if (response.toastMessage) {
      console.log('messageService:', this.messageService);
      this.messageService.add(response.toastMessage);
    }
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'default-bg');
    callAPI(this.eventService.getAllEvents()).then((response) => this.appendEvents(response));
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'default-bg');
  }

  updatePaginatedEvents(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedEvents();
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
