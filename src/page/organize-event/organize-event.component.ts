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
import Cause from '@/interface/Cause';
import {CauseService} from '@/service/CauseService';
import {AppService} from '@/service/AppService';
import {CreateCauseDialogComponent} from '@/component/create-cause-dialog/create-cause-dialog.component';
import AppUser from '@/interface/AppUser';

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
  activeUser: AppUser = {} as AppUser;

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

  /**
   * Inicializa el componente y carga la lista de países desde la API y las Causas en el rango del usuario.
   * También inicializa el actualizador de imagen y establece el texto predeterminado del uploader.
   * @returns void
   */
  ngOnInit(): void {
    putFormBackground(this.renderer);
    this.loadCountries();
    this.loadCausesInUsersRange();
    this.initializeImageUpdater();
    this.setUploaderDefaultText();
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });
  }


  /**
   * Carga la lista de países desde la API y la asigna a la variable de clase correspondiente.
   * @returns void
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

  /**
   * Carga las causas en el rango del usuario desde la API y las asigna a la variable de clase correspondiente.
   * @returns void
   */
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
   * Inicializa el actualizador de imagen.
   * @returns void
   */
  initializeImageUpdater(): void {
    setInterval(() => {
      this.updateImageFromDOM();
      this.updateUploaderText('#my-uploader span', 'Subir imagen');
    }, 1500);
  }

  /**
   * Actualiza la imagen de fondo.
   * @returns void
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
   * Establece el texto predeterminado del uploader.
   * @returns void
   */
  setUploaderDefaultText(): void {
    this.updateUploaderText('.uc-visual-drop-area', 'Subir imagen');
  }

  /**
   * Actualiza el texto del elemento del uploader especificado por el selector.
   * @param selector - El selector CSS del elemento a actualizar.
   * @param text - El texto a establecer para el elemento.
   * @returns void
   */
  updateUploaderText(selector: string, text: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = text;
    }
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   * @returns void
   */
  ngOnDestroy(): void {
    removeFormBackground(this.renderer);
  }

  /**
   * Valida la fecha y la hora del evento.
   * @param $event - El evento que desencadena la validación.
   * @returns void
   */
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

  /**
   * Cambia el país seleccionado y carga las provincias correspondientes.
   * @returns void
   */
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

  /**
   * Convierte los datos del formulario en un objeto Event.
   * @returns Event
   */
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
      idOwner: this.activeUser.id,
      idCause: this.formData['cause']
    }
  }

  /**
   * Envía el formulario para crear un evento y cambia los estados en los diferentes modales.
   * @returns void
   */
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

  /**
   * Comprueba si el formulario es válido.
   * @returns boolean
   */
  isFormValid(): boolean {
    return Object.keys(this.formData).every((key) => this.formData[key] !== '' && !this.isFieldInvalid(key));
  }

  /**
   * Si la imagen no se puede cargar, se establece una imagen de marcador de posición.
   * @param $event
   * @returns void
   */
  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }

  /**
   * Valida un campo del formulario.
   * @param fieldName
   * @returns void
   */
  validateField(fieldName: string): void {
    const value = this.formData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules? validateField(value, rules) || '':'';
  }

  /**
   * Comprueba si un campo del formulario es inválido.
   * @param fieldName
   * @returns boolean
   */
  isFieldInvalid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  /**
   * Abre el modal de confirmación para crear un evento.
   * @returns void
   */
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

  /**
   * Abre el modal de creación de evento.
   * @returns void
   */
  openDialog() {
    this.createEventProcessDialogVisible = true;
    try {
      this.onSubmit();
    } catch (error) {
      this.createEventProcessDialogStepActive = 3;
    }
  }

  /**
   * Cierra el modal de creación de evento.
   * @returns void
   */
  closeCreateEventProcessDialog() {
    this.createEventProcessDialogVisible = false;
    this.createEventProcessDialogStepActive = 0;
  }

  /**
   * Abre el modal de creación de causa.
   * @returns void
   */
  openCreateCauseDialog() {
    this.child.openDialog();
  }

  /**
   * Añade la causa creada en el modal de las causas al array de causas y la selecciona.
   * @param $event
   * @returns void
   */
  addCause($event: Cause) {
    this.causes.push($event);
    this.formData['cause'] = $event.id;
  }
}
