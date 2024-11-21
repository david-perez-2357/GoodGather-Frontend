import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AvatarModule} from 'primeng/avatar';
import {StepperModule} from 'primeng/stepper';
import {NgClass} from '@angular/common';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {PasswordModule} from 'primeng/password';
import {ToggleButtonModule} from 'primeng/togglebutton';

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
    ToggleButtonModule
  ],
  templateUrl: './buy-ticket-dialog.component.html',
  styles: ``
})
export class BuyTicketDialogComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  StepActive: number = 0;

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }
}
