import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, Renderer2, ViewChild,} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import Event from '@/interface/Event';
import { putFormBackground, removeFormBackground } from '@/method/background-methods';
import { callAPI } from '@/method/response-mehods';
import {NgClass, NgIf} from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { EventService } from '@/service/EventService';
import {LocationService} from '@/service/LocationService';
import ApiResponse from '@/interface/ApiResponse';
import {convertToLocationList} from '@/method/location-methods';
import Location from '@/interface/Location';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {StaticValidationRules, validateField, ValidationRule} from '@/method/validate-methods';
import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css";
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AvatarModule} from 'primeng/avatar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RouterLink} from '@angular/router';
import {getCurrentUser} from '@/method/app-user-methods';
import Cause from '@/interface/Cause';
import {CauseService} from '@/service/CauseService';
import {AppService} from '@/service/AppService';
import {CreateCauseDialogComponent} from '@/component/create-cause-dialog/create-cause-dialog.component';

UC.defineComponents(UC);

@Component({
  selector: 'app-organize-event',
  standalone: true,
  imports: [
    StepperModule,
    Button,
    InputTextareaModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    NgIf,
    InputNumberModule,
    NgClass,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    AvatarModule,
    ProgressSpinnerModule,
    RouterLink,
    CreateCauseDialogComponent
  ],
  templateUrl: './organize-event.component.html',
  styles: ``,
  providers: [MessageService, ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OrganizeEventComponent implements OnInit, OnDestroy {
  causes: Cause[] = [];
  countries: any[] | undefined;
  provinces: Location[] = [];
  minStartDateDate: string = moment().format('YYYY-MM-DD');
  stepActive: number = 0;
  createEventProcessDialogVisible: boolean = false;
  createEventProcessDialogStepActive: number = 0;
  createdEventId: number = 0;

  formData: { [key: string]: any } = {
    name: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    capacity: 1,
    address: '',
    province: '',
    country: '',
    ticketPrice: 0.0,
    cause: 1,
    startTime: '',
    endTime: ''
  };

  errors: { [key: string]: string } = {};

  fieldRules: { [key: string]: ValidationRule[] } = {
    name: [
      StaticValidationRules['required']
    ],
    image: [
      StaticValidationRules['required']
    ],
    description: [
      StaticValidationRules['required']
    ],
    startDate: [
      StaticValidationRules['required']
    ],
    endDate: [
      StaticValidationRules['required']
    ],
    capacity: [
      StaticValidationRules['required']
    ],
    address: [
      StaticValidationRules['required']
    ],
    province: [
      StaticValidationRules['required']
    ],
    country: [
      StaticValidationRules['required']
    ],
    ticketPrice: [
      StaticValidationRules['required']
    ],
    cause: [
      StaticValidationRules['required']
    ],
    startTime: [
      StaticValidationRules['required']
    ],
    endTime: [
      StaticValidationRules['required']
    ]
  }

  @ViewChild(CreateCauseDialogComponent) child!: CreateCauseDialogComponent;

  constructor(private renderer: Renderer2, private locationService: LocationService, private eventService: EventService, private messageService: MessageService, private confirmationService: ConfirmationService, private causeService: CauseService, private appService: AppService) {}

  ngOnInit(): void {
    putFormBackground(this.renderer);
    this.loadCountries();
    this.loadCausesInUsersRange();
    this.initializeImageUpdater();
    this.setUploaderDefaultText();
  }

  /**
   * Loads the list of countries from the API and converts them to the desired format.
   */
  loadCountries(): void {
    callAPI(this.locationService.getAllCountries())
      .then((countryResponse: ApiResponse) => {
        this.countries = convertToLocationList(countryResponse.data);
      })
      .catch((error: any) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al cargar los países'});
      });
  }

  loadCausesInUsersRange(): void {
    const userId = 1; // Replace with your method to get the current user ID

    callAPI(this.causeService.getCausesInUsersRange(userId)).then((response: ApiResponse) => {
      if (response.status !== 200) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al cargar las causas'});
        return;
      }else{
        this.causes = response.data;
      }
    }).catch((error: any) => {
      this.appService.showWErrorInApp(error);
    });

  }

  /**
   * Initializes a periodic function to update the event's image from the DOM.
   */
  initializeImageUpdater(): void {
    setInterval(() => {
      this.updateImageFromDOM();
      this.updateUploaderText('#my-uploader span', 'Subir imagen');
    }, 1500);
  }

  /**
   * Updates the event's image property based on a specific DOM element's style attribute.
   */
  updateImageFromDOM(): void {
    const imageElement = document.querySelector('.uc-thumb');
    const styleAttribute = imageElement?.getAttribute('style');
    const imageSrc = styleAttribute?.split(' ')[1]?.slice(5, -2)?.split('-/')[0];

    if (imageSrc) {
      this.formData['image'] = imageSrc;
    }
  }

  /**
   * Sets default text for the uploader element on initialization.
   */
  setUploaderDefaultText(): void {
    this.updateUploaderText('.uc-visual-drop-area', 'Subir imagen');
  }

  /**
   * Updates the inner text of an element selected by a query selector.
   * @param selector The query selector for the element.
   * @param text The text to set for the element.
   */
  updateUploaderText(selector: string, text: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = text;
    }
  }


  ngOnDestroy(): void {
    removeFormBackground(this.renderer);
  }

  dateAndTimeValidator($event: any): void {

    const startDate = moment(this.formData['startDate'], 'YYYY-MM-DD');
    const endDate = moment(this.formData['endDate'], 'YYYY-MM-DD');
    const startHour = moment(this.formData['startTime'], 'HH:mm');
    const endHour = moment(this.formData['endTime'], 'HH:mm');

    if (startDate.isSame(endDate) && endHour.isBefore(startHour)) {
      this.formData['endTime'] = this.formData['startTime'];
    }
    if (endDate.isBefore(startDate)) {
      this.formData['endDate'] = this.formData['startDate'];
    }
  }

  countryChange(): void {
    const countryCode = this.formData['country']?.code;
    this.formData['province'] = '';

    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse: ApiResponse) => {
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error: any) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al cargar las provincias'});
      });
  }

  convertFormDataToEvent(): Event {
    return {
      id: 0,
      name: this.formData['name'],
      description: this.formData['description'],
      image: this.formData['image'],
      startDate: this.formData['startDate']+ ' ' + this.formData['startTime'],
      endDate: this.formData['endDate']+ ' ' + this.formData['endTime'],
      capacity: this.formData['capacity'],
      boughtTickets: 0,
      address: this.formData['address'],
      province: this.formData['province'],
      country: this.formData['country'].name,
      ticketPrice: this.formData['ticketPrice'],
      deleted: 0,
      idOwner: getCurrentUser().id,
      idCause: this.formData['cause']
    }
  }

  onSubmit(): void {
    const event = this.convertFormDataToEvent();
    this.createEventProcessDialogStepActive = 1;
    setTimeout(() => {
      callAPI(this.eventService.createEvent(event))
        .then((response: ApiResponse) => {
          if (response.status === 200) {
            this.createEventProcessDialogStepActive = 2;
            this.createdEventId = response.data.id;
          } else {
            this.createEventProcessDialogStepActive = 3;
          }
        }).catch((error: any) => {
        this.messageService.add(error.toastMessage);
        this.createEventProcessDialogStepActive = 3;
      });
    }, 1500);
  }

  isFormValid(): boolean {
    return Object.keys(this.formData).every((key) => this.formData[key] !== '' && !this.isFieldInvalid(key));
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }
  validateField(fieldName: string): void {
    const value = this.formData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules? validateField(value, rules) || '':'';
  }

  isFieldInvalid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  confirm() {
    if (!this.isFormValid()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos'});
      return;
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación de creación',
        message: `Estás a punto de crear el evento "${this.convertFormDataToEvent().name}". ¿Estás seguro de que quieres continuar?`,
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        icon: 'pi pi-info-circle',
        rejectButtonStyleClass: 'p-button-text',
        acceptLabel: 'Confirmar',
        accept: () => {
          this.openDialog();
        },
      });
    }
  }

  openDialog() {
    this.createEventProcessDialogVisible = true;
    try {
      this.onSubmit();
    } catch (error) {
      this.createEventProcessDialogStepActive = 3;
    }
  }

  closeCreateEventProcessDialog() {
    this.createEventProcessDialogVisible = false;
    this.createEventProcessDialogStepActive = 0;
  }

  openCreateCauseDialog() {
    this.child.openDialog();
  }

  addCause($event: Cause) {
    this.causes.push($event);
    this.formData['cause'] = $event.id;
  }
}
