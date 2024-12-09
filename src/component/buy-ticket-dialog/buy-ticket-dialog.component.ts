import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AvatarModule} from 'primeng/avatar';
import {StepperModule} from 'primeng/stepper';
import {NgForOf, NgIf} from '@angular/common';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {PasswordModule} from 'primeng/password';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {AccordionModule} from 'primeng/accordion';
import {BadgeModule} from 'primeng/badge';
import {MessagesModule} from 'primeng/messages';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DropdownModule} from 'primeng/dropdown';
import {InputMaskModule} from 'primeng/inputmask';
import {PanelModule} from 'primeng/panel';
import {BlockUIModule} from 'primeng/blockui';
import {StyleClassModule} from 'primeng/styleclass';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RouterLink} from '@angular/router';
import Ticket from '@/interface/Ticket';
import PaymentMethod from '@/interface/PaymentMethod';
import CardType from '@/interface/CardType';
import {TicketService} from '@/service/TicketService';
import {callAPI} from '@/method/response-mehods';
import moment from 'moment';
import {ToastModule} from 'primeng/toast';
import {validateField, ValidationRule, StaticValidationRules, DynamicValidationRules} from '@/method/validate-methods';
import AppUser from '@/interface/AppUser';
import {AppService} from '@/service/AppService';


@Component({
  selector: 'app-buy-ticket-dialog',
  standalone: true,
  imports: [
    DialogModule,
    Button,
    InputTextModule,
    AvatarModule,
    StepperModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    ToggleButtonModule,
    AccordionModule,
    BadgeModule,
    MessagesModule,
    InputNumberModule,
    FormsModule,
    NgIf,
    RadioButtonModule,
    NgForOf,
    DropdownModule,
    InputMaskModule,
    PanelModule,
    BlockUIModule,
    StyleClassModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    RouterLink,
    ToastModule
  ],
  templateUrl: './buy-ticket-dialog.component.html',
  styles: ``,
  providers: [ConfirmationService, MessageService]
})
export class BuyTicketDialogComponent implements OnInit {
  // Propiedades de visibilidad y estado de la interfaz
  @Input() visible: boolean = false;
  @Input() eventId: number = 0;
  @Input() eventName: string = '';
  @Input() ticketPrice: number = 0;
  @Input() ticketsLeft: number = 10;
  @Input() onHomePage: boolean = false;
  @Output() closeTicketDialog = new EventEmitter<void>();
  activeUser: AppUser = {} as AppUser;

  // Estado del proceso de compra
  stepActive: number = 0;
  quantity: number = 1;
  maxQuantity: number = 10;
  ticketsBought: Ticket[] = [];
  numTicketsBought: number = 0;
  currentMaxQuantity: number = 10;
  ticketsBoughtDates: string[] = [];

  // Métodos de pago
  paymentMethods: PaymentMethod[] = [
    { label: 'Tarjeta de crédito', value: 'creditCard', icon: 'pi pi-credit-card' },
    { label: 'Paypal', value: 'paypal', icon: 'pi pi-paypal' },
  ];
  selectedPaymentMethod: string = 'creditCard';

  // Tipos de tarjeta de crédito
  cardTypes: CardType[] = [
    { value: 'visa', label: 'Visa', mask: '4 999 9999 9999 9999' },
    { value: 'mastercard', label: 'Mastercard', mask: '5 999 9999 9999 9999' },
    { value: 'amex', label: 'American Express', mask: '3 999 999999 99999' },
    { value: 'dinersclub', label: 'Diners Club', mask: '3 999 999999 9999' },
    { value: 'discover', label: 'Discover', mask: '6 999 9999 9999 9999' },
    { value: 'jcb', label: 'JCB', mask: '3 999 9999 9999 9999' },
    { value: 'maestro', label: 'Maestro', mask: '5 999 9999 9999 9999' }
  ];
  selectedCardType: CardType = this.cardTypes[0];

  // Información del pago
  creditCardFormData: { [key: string]: string } = {
    accountOwner: '',
    accountNumber: '',
    expirationDate: '',
    cvv: ''
  };

  paypalFormData: { [key: string]: string } = {
    paypalEmail: '',
    paypalPassword: ''
  };

  errors: { [key: string]: string } = {};


  fieldRules: { [key: string]: ValidationRule[] } = {
    accountOwner: [
      StaticValidationRules['required'],
    ],
    accountNumber: [
      StaticValidationRules['required'],
      StaticValidationRules['onlyNumbersAndSpaces'],
    ],
    expirationDate: [
      StaticValidationRules['required'],
    ],
    cvv: [
      StaticValidationRules['required'],
      DynamicValidationRules['lengthRange'](3, 3),
      StaticValidationRules['onlyNumbers'],
    ],
    paypalEmail: [
      StaticValidationRules['required'],
      StaticValidationRules['email'],
    ],
    paypalPassword: [
      StaticValidationRules['required'],
    ],
  };

  // Fecha actual
  currentDate: string = moment().format('DD/MM/YYYY');

  // Diálogo de proceso de compra
  purchaseProcessDialogVisible: boolean = false;
  purchaseProcessDialogStepActive: number = 0;

  constructor(private confirmationService: ConfirmationService, private appService: AppService, private ticketService: TicketService, private messageService: MessageService) {}

  // Inicialización de la componente
  ngOnInit() {
    this.updateMaxQuantity();
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

  // Funciones relacionadas con el diálogo de compra

  /**
   * Abre el diálogo de compra de entradas y comienza el proceso de compra
   * @returns void
   */
  openPurchaseProcessDialog() {
    this.purchaseProcessDialogVisible = true;
    this.purchaseProcessDialogStepActive = 1;

    if (this.numTicketsBought >= this.maxQuantity) {
      this.purchaseProcessDialogStepActive = 4;
    }else {
      this.purchaseTicket()
        .then(() => {
          setTimeout(() => {
            this.purchaseProcessDialogStepActive = 2;
          }, 2000);
        })
        .catch(() => {
          setTimeout(() => {
            this.purchaseProcessDialogStepActive = 3;
          }, 2000);
        });
    }
  }

  /**
   * Cierra el diálogo de compra de entradas
   * @returns void
   */
  closeDialog() {
    this.visible = false;
    this.closeTicketDialog.emit();
  }

  /**
   * Abre el modal de confirmación de compra de entradas
   * @param event
   */
  confirmPurchase(event: Event) {
    if (this.quantity > this.currentMaxQuantity || this.quantity <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `No puedes comprar más de ${this.maxQuantity} entradas para este evento` });
      return;
    }

    if (this.quantity > this.ticketsLeft) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Solo quedan ${this.ticketsLeft} entradas disponibles para este evento` });
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estás a punto de comprar ${this.quantity} ${this.quantity === 1 ? 'entrada' : 'entradas'} para el evento ${this.eventName} por un total de ${ (this.quantity * this.ticketPrice).toFixed(2) } €. ¿Deseas continuar?`,
      header: 'Confirmación de compra',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Confirmar',
      accept: () => {
        this.closeDialog();
        this.openPurchaseProcessDialog();
      },
      rejectButtonStyleClass: 'p-button-text',
    });
  }

  // Funciones relacionadas con el proceso de compra

  /**
   * Compra un ticket para el evento actual
   * @returns Promise<void>
   */
  async purchaseTicket() {
    const ticket: Ticket = {
      id: 0,
      price: Number((this.ticketPrice * this.quantity).toFixed(2)),
      amount: this.quantity,
      purchaseDate: moment().format('YYYY-MM-DD HH:mm'),
      idEvent: this.eventId,
      idUser: this.activeUser.id,
    };

    try {
      await callAPI(this.ticketService.buyTicket(ticket));
    } catch (error) {
      console.error('Error al comprar el ticket', error);
      throw error;
    }
  }

  /**
   * Cierra el diálogo de proceso de compra
   * @returns void
   */
  closePurchaseProcessDialog() {
    this.purchaseProcessDialogVisible = false;
    this.purchaseProcessDialogStepActive = 0;
    this.resetTicketDialog();
    if (!this.onHomePage)
      window.location.reload();
  }

  /**
   * Reinicia el formulario de compra de entradas
   * @returns void
   */
  resetTicketDialog() {
    this.quantity = 1;
    this.selectedPaymentMethod = 'creditCard';
    this.selectedCardType = this.cardTypes[0];
    this.creditCardFormData = {
      accountNumber: '',
      expirationDate: '',
      cvv: ''
    };
    this.paypalFormData = {
      paypalEmail: '',
      paypalPassword: ''
    };
    this.updateMaxQuantity();
    this.errors = {};
    this.stepActive = 0;
  }

  // Funciones relacionadas con la obtención de tickets

  /**
   * Obtiene los tickets comprados por el usuario
   * @returns Promise<Ticket[]>
   */
  async getBoughtTickets(): Promise<Ticket[]> {
    this.ticketsBought = [];
    this.numTicketsBought = 0;
    const idUser = this.activeUser.id;

    return callAPI(this.ticketService.getTicketsBoughtByUserAndEvent(idUser, this.eventId)).then((response) => {
      return response.data;
    }).catch((error) => {
      this.messageService.add(error.toastMessage);
      this.closeDialog();
      return [];
    });
  }

  /**
   * Muestra el diálogo de compra de entradas
   * @returns Promise<void>
   */
  async showDialog() {
    this.visible = true;

    this.ticketsBought = await this.getBoughtTickets();
    this.updateNumTicketsBought();
    this.updateMaxQuantity();
    this.updateTicketsBoughtDates();

    if (this.numTicketsBought >= this.maxQuantity) {
      this.quantity = 0;
    }
  }

  /**
   * Actualiza la cantidad máxima de entradas que se pueden comprar
   * @returns void
   */
  updateMaxQuantity() {
    this.currentMaxQuantity = this.maxQuantity - this.numTicketsBought;
  }

  /**
   * Actualiza el número de entradas compradas
   * @returns void
   */
  updateNumTicketsBought() {
    this.numTicketsBought = this.ticketsBought.reduce((acc, ticket) => acc + ticket.amount, 0);
  }

  /**
   * Actualiza las fechas de compra de las entradas
   * @returns void
   */
  updateTicketsBoughtDates() {
    this.ticketsBoughtDates = [];
    for (let ticket of this.ticketsBought) {
      for (let i = 0; i < ticket.amount; i++) {
        this.ticketsBoughtDates.push(moment(ticket.purchaseDate).format('DD/MM/YYYY'));
      }
    }
  }

  /**
   * Comprueba si el formulario seleccionado es válido
   * @returns boolean
   */
  selectedFormIsValid(): boolean {
    return this.selectedPaymentMethod === 'creditCard' ? this.isCreditCardFormValid() : this.isPaypalFormValid();
  }

  /**
   * Comprueba si el formulario de tarjeta de crédito es válido
   * @returns boolean
   */
  isCreditCardFormValid(): boolean {
    return Object.keys(this.creditCardFormData).every((key) => this.creditCardFormData[key] !== '' && !this.isFieldInvalid(key));
  }

  /**
   * Comprueba si el formulario de Paypal es válido
   * @returns boolean
   */
  isPaypalFormValid(): boolean {
    return Object.keys(this.paypalFormData).every((key) => this.paypalFormData[key] !== '' && !this.isFieldInvalid(key));
  }

  /**
   * Valida un campo del formulario de pago
   * @param fieldName
   * @return void
   */
  validateField(fieldName: string): void {
    const value = this.creditCardFormData[fieldName] || this.paypalFormData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules ? validateField(value, rules) || '' : '';
  }

  /**
   * Comprueba si un campo es inválido
   * @param fieldName
   * @return boolean
   */
  isFieldInvalid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  /**
   * Obtiene el nombre completo del usuario activo
   * @returns string
   */
  getFullUserName() {
    return `${this.activeUser.name} ${this.activeUser.surname}`;
  }

  /**
   * Obtiene el nombre del usuario activo
   * @returns string
   */
  getUsername() {
    return this.activeUser.username;
  }
}
