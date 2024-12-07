import { Component, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
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
import { EventService } from '@/service/EventService';
import { callAPI } from '@/method/response-mehods';
import Event from '@/interface/Event';
import { EventComponent } from '@/component/event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { CauseComponent } from '@/component/cause/cause.component';
import { CauseService } from '@/service/CauseService';
import Cause from '@/interface/Cause';
import { AppService } from '@/service/AppService';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {DividerModule} from 'primeng/divider';
import {BuyTicketDialogComponent} from '@/component/buy-ticket-dialog/buy-ticket-dialog.component';
import AppUser from '@/interface/AppUser';

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
    NgClass,
    ProgressSpinnerModule,
    NgOptimizedImage,
    DividerModule,
    BuyTicketDialogComponent,
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
  rangeValues: [number, number] = [0, 1000];
  activeFilters: number = 0;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  filteredEvents: Event[] = [];
  filteredGroupedEvents: { [causeId: number]: Event[] } = {};
  activeFilter: string | null = null;
  loadingData: boolean = true;
  minTickets: number = 1;
  previousMinTicketsWasOne = false;
  activeUser = {} as AppUser;


  buyTicketDialogVisible: boolean = false;
  buyTicketDialog = {
    eventId: 0,
    eventName: '',
    ticketPrice: 0.0,
    ticketsLeft: 0,
  }

  sliderFilterActive: boolean = false;
  selectFilterActive: boolean = true;

  constructor(
    private renderer: Renderer2,
    private eventService: EventService,
    private causeService: CauseService,
    private messageService: MessageService,
    private appService: AppService,
  ) {}

  @ViewChild(BuyTicketDialogComponent) child!: BuyTicketDialogComponent;

  showBuyTicketDialog(event: Event) {
    this.buyTicketDialog.eventId = event.id;
    this.buyTicketDialog.eventName = event.name;
    this.buyTicketDialog.ticketPrice = event.ticketPrice;
    this.buyTicketDialog.ticketsLeft = event.capacity - event.boughtTickets;

    if (this.buyTicketDialog.eventId !== this.child.eventId) {
      this.child.resetTicketDialog();
    }

    setTimeout(() => {
      this.buyTicketDialogVisible = true;
      this.child.showDialog();
    }, 2);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'default-bg');
    this.loadingData = true;
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });

    Promise.all([callAPI(this.causeService.getAllCauses()), callAPI(this.eventService.getAllEvents())])
      .then(([causesResponse, eventsResponse]) => {
        if (causesResponse.status === 200) {
          this.causes = causesResponse.data;
        } else if (causesResponse.toastMessage) {
          this.messageService.add(causesResponse.toastMessage);
        }

        if (eventsResponse.status === 200) {
          this.events = eventsResponse.data;
          this.filteredEvents = [...this.events];
        } else if (eventsResponse.toastMessage) {
          this.messageService.add(eventsResponse.toastMessage);
        }

        this.totalRecords = this.filteredEvents.length;
        this.updatePaginatedCauses();
        this.updateActiveFilters();
        this.loadingData = false;
        this.applyFilters();
      })
      .catch((error) => {
        this.appService.showWErrorInApp(error);
      });
  }


  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'default-bg');
  }

  updatePaginatedCauses(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.paginatedEvents = this.filteredEvents.slice(startIndex, endIndex);
    this.filteredGroupedEvents = this.groupEventsByCause(this.paginatedEvents, this.causes);
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

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedCauses();
    this.scrollToTarget();
  }

  updateActiveFilters(): void {
    this.activeFilters = 0;

    const [minPrice, maxPrice] = this.rangeValues;
    if (minPrice > 0 || maxPrice < 1000) {
      this.activeFilters++;
    }

    if (this.value) {
      this.activeFilters++;
    }

    if (this.minTickets !== 1) {
      this.activeFilters++;
    }
  }

  onRangeChange(): void {
    if (!this.sliderFilterActive) {
      this.sliderFilterActive = true;
      this.activeFilters++;
    }
    this.applyFilters();
    this.updateActiveFilters();
  }

  onSelectChange(): void {
    if (this.value && !this.selectFilterActive) {
      this.selectFilterActive = true;
      this.activeFilters++;
    } else if (!this.value && this.selectFilterActive) {
      this.selectFilterActive = false;
      this.activeFilters--;
    }
    this.applyFilters();
    this.updateActiveFilters();
  }

  applyFilters(): void {
    let result = [...this.events];

    // Filtrar por rango de precio
    if (this.rangeValues[0] !== 0 || this.rangeValues[1] !== 1000) {
      result = result.filter(event =>
        event.ticketPrice >= this.rangeValues[0] && event.ticketPrice <= this.rangeValues[1]
      );
    }

    // Filtrar por búsqueda
    if (this.searchQuery) {
      result = result.filter(event =>
        event.name.toLowerCase().includes(this.searchQuery)
      );
    }

    // Filtrar por cantidad mínima de tickets
    if (this.minTickets > 0) {
      result = result.filter(event =>
        (event.capacity - event.boughtTickets) >= this.minTickets
      );
    }

    // Filtrar por ubicación del usuario
    if (this.activeUser) {
      if (this.value === 'country') {
        result = result.filter(event => event.country === this.activeUser.country);
      } else if (this.value === 'province') {
        result = result.filter(event => event.province === this.activeUser.province);
      }
    }

    // Aplicar el filtro activo
    if (this.activeFilter === 'popular') {
      result = result.sort((a, b) => b.boughtTickets - a.boughtTickets);
    } else if (this.activeFilter === 'recent') {
      result = result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (this.activeFilter === 'cheapest') {
      result = result.sort((a, b) => {
        const priceA = a.ticketPrice || 0; // Eventos gratis considerados como 0
        const priceB = b.ticketPrice || 0;
        return priceA - priceB;
      });
    }

    // Actualizar eventos filtrados y paginación
    this.filteredEvents = result;
    this.totalRecords = this.filteredEvents.length;
    this.updatePaginatedCauses();
    this.updateActiveFilters();
  }



  toggleOverlay(event: MouseEvent): void {
    this.overlay.toggle(event);
  }

  onCheapestClick(searchInput: HTMLInputElement): void {
    if (this.activeFilter === 'cheapest') {
      this.resetFilter();
    } else {
      this.activeFilter = 'cheapest';
    }
    this.searchQuery = '';
    this.applyFilters();
    searchInput.value = '';
  }

  onPopularClick(searchInput: HTMLInputElement): void {
    if (this.activeFilter === 'popular') {
      this.resetFilter();
    } else {
      this.activeFilter = 'popular';
    }
    this.searchQuery = '';
    this.applyFilters();
    searchInput.value = '';
  }

  onRecentClick(searchInput: HTMLInputElement): void {
    if (this.activeFilter === 'recent') {
      this.resetFilter();
    } else {
      this.activeFilter = 'recent';
    }
    this.searchQuery = '';
    this.applyFilters();
    searchInput.value = '';
  }

  onMinTicketsChange(): void {
    if (this.minTickets !== 1 && this.previousMinTicketsWasOne) {
      this.activeFilters++;
      this.previousMinTicketsWasOne = false;
    }

    if (this.minTickets === 1 && !this.previousMinTicketsWasOne) {
      this.activeFilters--;
      this.previousMinTicketsWasOne = true;
    }

    this.applyFilters();
    this.updateActiveFilters();
  }

  scrollToTarget() {
    const target = document.getElementById('scrollDiv');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  resetFilter(): void {
    this.activeFilter = null;
    this.applyFilters();
  }


  protected readonly Object = Object;
}
