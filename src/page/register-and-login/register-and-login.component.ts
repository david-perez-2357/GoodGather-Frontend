import {Component, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LocationService} from '@/service/LocationService';
import Location from '@/interface/Location';
import {FormsModule,} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputOtpModule} from 'primeng/inputotp';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CommonModule, NgIf} from '@angular/common';
import {putFormBackground, removeFormBackground} from '@/method/background-methods';
import {MessageModule} from 'primeng/message';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '../../interface/ApiResponse';
import {convertToLocationList} from '@/method/location-methods';
import {ActivatedRoute, Router} from '@angular/router';
import {UserClientService} from '@/service/UserClientService';
import {MessageService} from 'primeng/api';
import UserClient from '@/interface/UserClient';
// import {validateField, ValidationRule, StaticValidationRules, DynamicValidationRules} from '@/method/validate-methods';


@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule,
    DropdownModule, DialogModule, CalendarModule, FloatLabelModule, FormsModule,
    InputOtpModule, SelectButtonModule, NgIf, CommonModule, MessageModule
  ],
  templateUrl: './register-and-login.component.html',
  styles: ``,
  providers:[MessageService],
  schemas: []
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {

  countries: Location[] = [];
  provinces:Location[] = [];
  username: string = '';
  password: string = '';

  user: UserClient = {
    id:0,
    idClient:0,
    username:'',
    password:'',
    firstname:'',
    surname:'',
    email:'',
    birthdate:'',
    country:'',
    province:''

  }


  // errors: { [key: string]: string } = {};

  // emailFormData: { [key: string]: string } = {
  //   registerEmail: '',
  //
  // };
  //
  // passwordFormData: { [key: string]: string } = {
  //   registerPassword: '',
  //
  // };

  // fieldRules: { [key: string]: ValidationRule[] } = {
  //   registerUsername:[StaticValidationRules['required']
  //
  //   ],
  //   registerPassword:[
  //     StaticValidationRules['required'],
  //     StaticValidationRules['alphanumeric'],
  //     DynamicValidationRules['lengthRange'](8, 12),
  //   ],
  //   registerEmail:[
  //     StaticValidationRules['required'],
  //     StaticValidationRules['email'],
  //   ]
  //
  // }


  // isFieldInvalid(fieldName: string): boolean {
  //   return !!this.errors[fieldName];
  // }
  //
  // validateField(fieldName: string): void {
  //   const value = this.emailFormData[fieldName] || this.passwordFormData[fieldName];
  //   const rules = this.fieldRules[fieldName];
  //   this.errors[fieldName] = rules ? validateField(value, rules) || '' : '';
  // }

  stateOptions: any[] = [
    { label: ' Iniciar sesión', value: 'login' },
    { label: 'Registrarse', value: 'register' }];

  activeForm: string = '';

  countryChange() {
    const countryCode:string = this.country.code;
    this.user.province='';
    this.user.country= this.country.name;
    console.log('Country name:', countryCode);
    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse:ApiResponse) =>{
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error:any)=>{
        console.error('Error getting states:', error);

      });
  }

  country:Location = {
    name:'',
    code:''
  }

  // @Inject(UserClientService)private userClientService:UserClientService

  constructor(private renderer: Renderer2,
              private locationService:LocationService, private route: ActivatedRoute,
              @Inject(UserClientService)private userClientService:UserClientService, private messageService: MessageService) {
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

  prueba($event: DropdownChangeEvent) {
    this.user.province = $event.value;
  }


  onSubmit(): void {
    console.log(this.user);

    callAPI(this.userClientService.createUser(this.user))
      .then((response: ApiResponse) => {
        if (response.status === 200) {
          console.log('usuario registrado')
          // this.messageService.add({severity: 'success', summary: 'Evento creado', detail: 'El evento se ha creado correctamente'});
        }
        // else if (response.toastMessage) {
        //   this.messageService.add(response.toastMessage);
        // }
      }).catch((error: any) => {
        console.log('error en el registro')
      // this.messageService.add(error.toastMessage);
    });
  }

  onLogin(): void {
    console.log(this.username, this.password);
    this.userClientService.doLogin(this.username, this.password);
  }


  ngOnDestroy() {
    removeFormBackground(this.renderer);
  }


}
