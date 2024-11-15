import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';





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
import {CommonModule, NgClass, NgIf} from '@angular/common';





@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule,
    DropdownModule, DialogModule, CalendarModule, FloatLabelModule, FormsModule, InputOtpModule, SelectButtonModule,
    NgClass, NgIf, CommonModule
  ],
  templateUrl: './register-and-login.component.html',
  styles: ``
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {
  value!: number;
  activeForm: string = 'login'
  paymentOptions: any[] = [
    { name: 'Iniciar sesión', value: 1 },
    { name: 'Registro', value: 2 },

  ];




  constructor(private renderer: Renderer2) {
  }



  ngOnInit() {
    this.renderer.addClass(document.body, 'form-bg');

  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'form-bg');

  }

  showLoginForm(){
    this.activeForm = 'login';
  }

  showRegisterForm(){
    this.activeForm = 'register';
  }



}
