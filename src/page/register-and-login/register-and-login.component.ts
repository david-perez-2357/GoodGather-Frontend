import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LocationService} from '../../service/LocationService';
import Location from '../../interface/Location';
import User from '../../interface/User';


import {
  FormsModule,

} from '@angular/forms';

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
import {MessageModule} from 'primeng/message';
import {callAPI} from '../../method/response-mehods';
import ApiResponse from '../../interface/ApiResponse';
import {convertToLocationList} from '../../method/location-methods';
import {ActivatedRoute} from '@angular/router';




@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule,
    DropdownModule, DialogModule, CalendarModule, FloatLabelModule, FormsModule,
    InputOtpModule, SelectButtonModule, NgIf, CommonModule, MessageModule
  ],
  templateUrl: './register-and-login.component.html',
  styles: ``
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {
  countries: Location[] = [];
  provinces:Location[] = [];

  user: User = {
    id:0,
    username:'',
    password:'',
    email:'',
    birthdate:'',
    country:'',
    province:''

  }
  stateOptions: any[] = [
    { label: ' Iniciar sesión', value: 'login' },
    { label: 'Registrarse', value: 'register' }];

  activeForm: string = '';

  password!: string;
  passwordError: string = '';

  email: string = '';
  emailError: string = '';

  birthdate: string = '';
  birthdateError: string = '';

  username: string = '';
  usernameError: string = '';


  constructor(private renderer: Renderer2,
             private locationService:LocationService, private route: ActivatedRoute) {
    }



  ngOnInit() {
    putFormBackground(this.renderer);

    callAPI(this.locationService.getAllCountries())
      .then((countryResponse: ApiResponse) => {
        this.countries = convertToLocationList(countryResponse.data);

      })
      .catch((error: any) => {
        console.error('Error fetching countries');
      });

    this.activeForm =this.route.snapshot.url[0].path === 'login' ? 'login' : 'register';



  }
  validateUsername() {
    if (!this.username.trim()) {
      this.usernameError = 'El nombre de usuario no puede estar vacío';
    } else {
      this.usernameError = '';
    }
  }

  validatePassword(){
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(this.password)){
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }else{
      this.passwordError = '';
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Por favor ingrese un email válido';
    } else {
      this.emailError = '';
    }
  }

  validateBirthdate(){
    if (!this.birthdate){
      this.birthdateError = 'Fecha de nacimiento es requerida';
      return;
    }
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
      age--;
    }
    if (age < 18){
      this.birthdateError = 'Debes ser mayor de 18 años';
    }else{
      this.birthdateError = '';
    }
  }

  countryChange() {
    const countryCode:string = this.user.country;
    this.user.province = '';
    console.log('Country code:', countryCode);
    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse:ApiResponse) =>{
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error:any)=>{
        console.error('Error getting states:', error);

      });
  }


// // onSubmit(){
// //   callAPI(this.eventService.createEvent(this.event))
// //     .then((response: ApiResponse) => {
// //       console.log('Event created:', response.data);
// //     })
// //     .catch((error: any) => {
// //       console.error('Error creating event:', error);
// //     });
// // }
// }


 ngOnDestroy() {
    removeFormBackground(this.renderer);
  }

}
