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
import {validateField, ValidationRule, ValidationRules} from '@/method/validate-methods';

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
  @Output() closeTicketDialog = new EventEmitter<void>();

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
  accountNumber: string = '';
  expirationDate: string = '';
  cvv: number = 0;
  paypalEmail: string = '';
  paypalPassword: string = '';

  creditCardFormData: { [key: string]: string } = {
    accountNumber: '',
    expirationDate: '',
    cvv: ''
  };

  paypalFormData: { [key: string]: string } = {
    email: '',
    password: ''
  };

  errors: { [key: string]: string } = {};

  // export const ValidationRules: { [key: string]: ValidationRule | ((...args: any[]) => ValidationRule) } = {

  fieldRules: { [key: string]: ValidationRule[] } = {
    accountNumber: [
      ValidationRules['required'],
      // @ts-ignore
      ValidationRules['lengthRange'](16, 16),
      ValidationRules['onlyNumbers'],
    ],
    expirationDate: [
      // @ts-ignore
      ValidationRules['required'],
    ],
    cvv: [
      ValidationRules['required'],
      // @ts-ignore
      ValidationRules['lengthRange'](3, 4),
      ValidationRules['onlyNumbers'],
    ],
    paypalEmail: [
      // @ts-ignore
      ValidationRules['required'],
      // @ts-ignore
      ValidationRules['email'],
    ],
    paypalPassword: [
      // @ts-ignore
      ValidationRules['required'],
    ],
  };

  // Fecha actual
  currentDate: string = moment().format('DD/MM/YYYY');

  // Diálogo de proceso de compra
  purchaseProcessDialogVisible: boolean = false;
  purchaseProcessDialogStepActive: number = 0;

  constructor(private confirmationService: ConfirmationService, private ticketService: TicketService, private messageService: MessageService) {}

  // Inicialización de la componente
  ngOnInit() {
    this.updateMaxQuantity();
  }


  // Funciones relacionadas con el diálogo de compra
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

  closeDialog() {
    this.visible = false;
    this.closeTicketDialog.emit();
  }

  // Confirmar compra
  confirmPurchase(event: Event) {
    if (this.quantity > this.currentMaxQuantity || this.quantity <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `No puedes comprar más de ${this.maxQuantity} entradas para este evento` });
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estás a punto de comprar ${this.quantity} ${this.quantity === 1 ? 'entrada' : 'entradas'} para el evento ${this.eventName} por un total de ${this.quantity * this.ticketPrice} €. ¿Deseas continuar?`,
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
  async purchaseTicket() {
    const ticket: Ticket = {
      id: 0,
      price: this.ticketPrice * this.quantity,
      amount: this.quantity,
      purchaseDate: moment().format('YYYY-MM-DD HH:mm'),
      idEvent: this.eventId,
      idUser: 1 // TODO: Cambiar por el id del usuario logueado
    };

    try {
      await callAPI(this.ticketService.buyTicket(ticket));
    } catch (error) {
      console.error('Error al comprar el ticket', error);
      throw error;
    }
  }

  closePurchaseProcessDialog() {
    this.purchaseProcessDialogVisible = false;
    this.purchaseProcessDialogStepActive = 0;
    this.resetTicketDialog();
    window.location.reload();
  }

  // Resetear el diálogo de compra
  resetTicketDialog() {
    this.quantity = 1;
    this.selectedPaymentMethod = 'creditCard';
    this.selectedCardType = this.cardTypes[0];
    this.accountNumber = '';
    this.expirationDate = '';
    this.cvv = 0;
    this.paypalEmail = '';
    this.paypalPassword = '';
    this.updateMaxQuantity();
    this.stepActive = 0;
  }

  // Funciones relacionadas con la obtención de tickets
  async getBoughtTickets(): Promise<Ticket[]> {
    return callAPI(this.ticketService.getTicketsBoughtByUserAndEvent(1, this.eventId)).then((response) => {
      return response.data;
    }).catch((error) => {
      this.messageService.add(error.toastMessage);
      this.closeDialog();
      return [];
    });
  }

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

  // Función para actualizar la cantidad máxima disponible
  private updateMaxQuantity() {
    this.currentMaxQuantity = this.maxQuantity - this.numTicketsBought;
  }

  // Funcion para actualizar la cantidad de tickets comprados
  private updateNumTicketsBought() {
    this.numTicketsBought = this.ticketsBought.reduce((acc, ticket) => acc + ticket.amount, 0);
  }

  // Función para actualizar las fechas de compra de los tickets
  private updateTicketsBoughtDates() {
    this.ticketsBoughtDates = [];
    for (let ticket of this.ticketsBought) {
      for (let i = 0; i < ticket.amount; i++) {
        this.ticketsBoughtDates.push(moment(ticket.purchaseDate).format('DD/MM/YYYY'));
      }
    }
  }

  // Validación de campos
  validateField(fieldName: string): void {
    const value = this.creditCardFormData[fieldName] || this.paypalFormData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules ? validateField(value, rules) || '' : '';
  }

  isFieldValid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }
}
