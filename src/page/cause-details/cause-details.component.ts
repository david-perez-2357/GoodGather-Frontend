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
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [
    NgForOf,
    EventComponent,
    NgClass,
    PaginatorModule,
    ToastModule
  ],
  templateUrl: './cause-details.component.html',
  styleUrls: ['./cause-details.component.css'],
  providers: [MessageService]
})
export class CauseDetailsComponent implements OnInit, OnDestroy{
  constructor(private renderer: Renderer2,
              private causeService: CauseService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private messageService: MessageService) {
  }

  causeId: number = 1
  cause: Cause = {} as Cause;
  events: Event[] = []

  totalFunds: number = 0;
  totalEvents: number = 0;
  totalDonors: number = 0;

  activeFilter: string | null = null;

  rows: number = 5;
  first: number = 0;
  totalRecords: number = 0;
  visibleEvents: Event[] = [];

  /**
   * Establece la causa de la página
   * @param response
   * @return void
   */
  setCause(response: ApiResponse): void {
    if (response.status === 200) {
      this.cause = response.data;
    }else {
      this.catchErrorMessage(response);
    }
  }

  /**
   * Carga los eventos de la causa
   * @return void
   * */
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

  /**
   * Manejador de errores de imagen
   * @param $event
   * @return void
   */
  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }

  /**
   * Muestra un mensaje de error en la aplicación
   * @param error
   * @return void
   */
  catchErrorMessage(error: any): void {
    this.appService.showWErrorInApp(error);
  }

  /**
   * Inicializa la página
   * @return void
   */
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

  /**
   * Muestra un mensaje informativo en un toast.
   * @return void
   */
  showInfoTicketButtonMessage() {
    this.messageService.add({severity: 'info', summary: 'Info', detail: 'No se puede comprar un ticket aquí'});
  }

  /**
   * Elimina el fondo por defecto de la página
   * @return void
   */
  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  /**
   * Obtiene los datos de la causa
   * @return void
   */
  getDataCause(): void {
    this.totalEvents = this.events.length;
    this.totalDonors = this.events.reduce((total, event) => {
      return total + (event.boughtTickets || 0);
    }, 0);
    this.totalFunds = this.events.reduce((total, event) => {
      return total + (event.boughtTickets * event.ticketPrice);
    }, 0);
  }

  /**
   * Aplica los filtros a los eventos
   * @return void
   */
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

  /**
   * Actualiza los eventos visibles
   * @return void
   */
  updateVisibleEvents(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.visibleEvents = this.events.slice(startIndex, endIndex);
  }

  /**
   * Manejador de cambio de página
   * @param event
   * @return void
   */
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updateVisibleEvents();
  }

  /**
   * Manejador de click en el filtro de eventos más baratos
   * @return void
   */
  onCheapestClick(): void {
    this.activeFilter = this.activeFilter === 'cheapest' ? null : 'cheapest';
    this.applyFilters();
  }

  /**
   * Manejador de click en el filtro de eventos más populares
   * @return
   * */
  onPopularClick(): void {
    this.activeFilter = this.activeFilter === 'popular' ? null : 'popular';
    this.applyFilters();
  }

  /**
   * Manejador de click en el filtro de eventos más recientes
   * @return void
   */
  onRecentClick(): void {
    this.activeFilter = this.activeFilter === 'recent' ? null : 'recent';
    this.applyFilters();
  }


}
