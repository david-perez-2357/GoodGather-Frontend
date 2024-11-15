import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputOtpModule} from 'primeng/inputotp';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CommonModule, NgIf} from '@angular/common';
import {putFormBackground, removeFormBackground} from '../../method/background-methods';


@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule,
    DropdownModule, DialogModule, CalendarModule, FloatLabelModule, FormsModule, InputOtpModule, SelectButtonModule, NgIf, CommonModule
  ],
  templateUrl: './register-and-login.component.html',
  styles: ``
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {

  stateOptions: any[] = [
    { label: 'Iniciar sesión', value: 'login' },
    { label: 'Registrarse', value: 'register' }];

  value: string = '                                      ';

  constructor(private renderer: Renderer2) {
  }



  ngOnInit() {
    putFormBackground(this.renderer);

  }

  ngOnDestroy() {
    removeFormBackground(this.renderer);
  }
}
