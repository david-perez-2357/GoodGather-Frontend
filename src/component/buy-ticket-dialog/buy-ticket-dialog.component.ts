import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AvatarModule} from 'primeng/avatar';
import {StepperModule} from 'primeng/stepper';
import {NgClass, NgForOf, NgIf} from '@angular/common';
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
import moment from 'moment';

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
    StyleClassModule
  ],
  templateUrl: './buy-ticket-dialog.component.html',
  styles: ``
})
export class BuyTicketDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() eventId: number = 0;
  @Input() eventName: string = '';
  @Input() ticketPrice: number = 0;
  @Input() ticketsLeft: number = 10;
  @Output() closeTicketDialog = new EventEmitter<void>();
  StepActive: number = 0;
  quantity: number = 1;
  maxQuantity: number = 10;
  ticketsBought: number = 4;
  currentMaxQuantity: number = 10;
  paymentMethods = [
    {label: 'Tarjeta de crédito', value: 'creditCard', icon: 'pi pi-credit-card'},
    {label: 'Paypal', value: 'paypal', icon: 'pi pi-paypal'},
  ];
  selectedPaymentMethod: string = 'creditCard';

  cardTypes = [
    { value: "visa", label: "Visa", mask: "4 999 9999 9999 9999" },
    { value: "mastercard", label: "Mastercard", mask: "5 999 9999 9999 9999" },
    { value: "amex", label: "American Express", mask: "3 999 999999 99999" },
    { value: "dinersclub", label: "Diners Club", mask: "3 999 999999 9999" },
    { value: "discover", label: "Discover", mask: "6 999 9999 9999 9999" },
    { value: "jcb", label: "JCB", mask: "3 999 9999 9999 9999" },
    { value: "maestro", label: "Maestro", mask: "5 999 9999 9999 9999" }
  ];

  selectedCardType: { value: string, label: string, mask: string } = this.cardTypes[0];
  accountNumber: string = '';
  expirationDate: string = '';
  cvv: number = 0;
  paypalEmail: string = '';
  paypalPassword: string = '';
  currentDate: string = moment().format('DD/MM/YYYY');


  ngOnInit() {
    this.currentMaxQuantity = this.maxQuantity - this.ticketsBought;
  }

  closeDialog() {
    this.visible = false;
    this.closeTicketDialog.emit();
  }
}
