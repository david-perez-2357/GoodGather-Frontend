import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AvatarModule} from 'primeng/avatar';
import {StepperModule} from 'primeng/stepper';
import {NgClass, NgIf} from '@angular/common';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {PasswordModule} from 'primeng/password';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {AccordionModule} from 'primeng/accordion';
import {BadgeModule} from 'primeng/badge';
import {MessagesModule} from 'primeng/messages';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-buy-ticket-dialog',
  standalone: true,
  imports: [
    DialogModule,
    Button,
    InputTextModule,
    AvatarModule,
    StepperModule,
    NgClass,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    ToggleButtonModule,
    AccordionModule,
    BadgeModule,
    MessagesModule,
    InputNumberModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './buy-ticket-dialog.component.html',
  styles: ``
})
export class BuyTicketDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() eventId: number = 0;
  @Input() ticketPrice: number = 0;
  @Input() ticketsLeft: number = 10;
  @Output() closeTicketDialog = new EventEmitter<void>();
  StepActive: number = 0;
  quantity: number = 1;
  maxQuantity: number = 10;
  ticketsBought: number = 4;
  currentMaxQuantity: number = 10;

  ngOnInit() {
    this.currentMaxQuantity = this.maxQuantity - this.ticketsBought;
  }

  closeDialog() {
    this.visible = false;
    this.closeTicketDialog.emit();
  }

}
