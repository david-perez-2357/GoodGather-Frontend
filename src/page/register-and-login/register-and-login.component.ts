import {Component, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LocationService} from '@/service/LocationService';
import Location from '@/interface/Location';
import {FormsModule,} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputOtpModule} from 'primeng/inputotp';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CommonModule, NgIf} from '@angular/common';
import {putFormBackground, removeFormBackground} from '@/method/background-methods';
import {MessageModule} from 'primeng/message';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '@/interface/ApiResponse';
import {convertToLocationList} from '@/method/location-methods';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@/service/AuthService';
import {MessageService} from 'primeng/api';
import UserClient from '@/interface/UserClient';
import {validateField, DynamicValidationRules, StaticValidationRules, ValidationRule} from '@/method/validate-methods';
import User from '@/interface/User';
import {ToastModule} from 'primeng/toast';
import moment from 'moment';




@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule,
    DropdownModule, DialogModule, CalendarModule, FloatLabelModule, FormsModule,
    InputOtpModule, SelectButtonModule, NgIf, CommonModule, MessageModule, ToastModule
  ],
  templateUrl: './register-and-login.component.html',
  styles: ``,
  providers:[MessageService],
  schemas: []
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2,
              private locationService:LocationService, private route: ActivatedRoute, private router: Router,
              private authService:AuthService, private messageService: MessageService) {

  }


  stateOptions: any[] = [
    { label: ' Iniciar sesión', value: 'login' },
    { label: 'Registrarse', value: 'register' }];

  activeForm: string = '';

  countries: Location[] = [];
  provinces:Location[] = [];


  country:Location = {
    name:'',
    code:''
  }

  /**Objeto que guarda mensajes de error de validación.**/
  errors: { [key: string]: string } = {};


/**Objetos que almacenan los datos de los formularios.**/
  loginFormData: { [key: string]: any } ={
    loginUsername: '',
    loginPassword:'',
  }

  registerFormData:{[key:string]:any} ={
    username:'',
    password:'',
    firstname:'',
    surname:'',
    email:'',
    birthdate:'',
    country:'',
    province:''

  }


/**Reglas de validación para cada campo del formulario**/

    fieldRules: { [key: string]: ValidationRule[] } = {
    loginUsername:[StaticValidationRules['required']

    ],
    loginPassword:[
      StaticValidationRules['required'],
    ],
    email:[
      StaticValidationRules['required'],
      StaticValidationRules['email']

    ],
    username:[
      StaticValidationRules['required'],

    ],
    password:[
      StaticValidationRules['required'],
      StaticValidationRules['alphanumeric'],
      DynamicValidationRules['lengthRange'](8, 8),

    ],
    birthdate:[
      StaticValidationRules['required'],
      StaticValidationRules['validDate']

    ],
    firstname:[
      StaticValidationRules['required'],

    ],
    surname:[
      StaticValidationRules['required'],

    ],
    country:[
      StaticValidationRules['required'],

    ],
    province:[
      StaticValidationRules['required'],

    ]


  }

/**Carga las provincias según el país seleccionado.**/

  countryChange() {
    const countryCode:string = this.registerFormData['country']?.code;
    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse:ApiResponse) =>{
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error:any)=>{
        console.error('Error getting states:', error);

      });
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

  /**
   * Convierte los datos del formulario de inicio de sesión en un objeto de tipo `User`.
   * @returns {User} Objeto que representa las credenciales del usuario para iniciar sesión.
   */
  convertFormDataToLoginUser():User{
    return {
      username: this.loginFormData['loginUsername'],
      password: this.loginFormData['loginPassword']
    }
  }


  /**
   * Convierte los datos del formulario de registro en un objeto de tipo `UserClient`.
   * @returns {UserClient} Objeto que contiene la información del usuario a registrar.
   */
  convertFormDataToUser(): UserClient {
    return {
      id: 0,
      username: this.registerFormData['username'],
      password: this.registerFormData['password'],
      idClient: 0,
      firstname: this.registerFormData['firstname'],
      surname: this.registerFormData['surname'],
      email: this.registerFormData['email'],
      birthdate: this.registerFormData['birthdate'],
      province: this.registerFormData['province'],
      country: this.registerFormData['country'].name,
    }
  }

  /**
   * Limpia los datos del formulario de registro.
   * @returns {void}
   */
  clearRegisterFormData():void{
    this.registerFormData ={
      id: 0,
      username:'',
      password: '',
      idClient: 0,
      firstname: '',
      surname: '',
      email: '',
      birthdate: '',
      province: '',
      country: '',

}
}

  /**
   * Maneja el envío del formulario de registro de usuario.
   * Valida los datos del formulario, realiza la solicitud de registro y navega al formulario de inicio de sesión si tiene éxito.
   * @returns {void}
   */
  onSubmit(): void {
    const user = this.convertFormDataToUser();
    if (!this.isRegisterFormValid()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos'});
      return;
    }

    callAPI(this.authService.createUser(user))
      .then((response: ApiResponse) => {
        console.log('Response status:', response.status);
        if (response.status === 200 || response.status === 201) {
         this.clearRegisterFormData();
         this.activeForm ="login"
          this.router.navigate(['/login']);

        } else if (response.toastMessage) {
          this.messageService.add(response.toastMessage);

        }
      }).catch((error: any) => {
      console.log('Error:', error);
      if (error.toastMessage){
        this.messageService.add(error.toastMessage);
      }
    });
  }

  /**
   * Verifica si todos los campos del formulario de registro son válidos.
   * @returns {boolean} `true` si todos los campos son válidos, de lo contrario `false`.
   */
  isRegisterFormValid(): boolean {
    return Object.keys(this.registerFormData).every((key) => this.registerFormData[key] !== '' && !this.isFieldInvalid(key));
  }


  /**
   * Verifica si todos los campos del formulario de inicio de sesión son válidos.
   * @returns {boolean} `true` si todos los campos son válidos, de lo contrario `false`.
   */
  isLoginFormValid(): boolean {
    return Object.keys(this.loginFormData).every((key) => this.loginFormData[key] !== '' && !this.isFieldInvalid(key));
  }

  /**
   * Valida un campo específico del formulario utilizando reglas predefinidas.
   * @param {string} fieldName - Nombre del campo a validar.
   */
  validateField(fieldName: string): void {
    const value = this.registerFormData[fieldName] || this.loginFormData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules ? validateField(value, rules) || '' : '';
  }

  usernameExists: boolean | null = null;
  emailExists: boolean | null = null;
  /**
   * Valida si un nombre de usuario ya existe en el sistema.
   * @returns {void}
   */
  validateUsername():void{
    const user = this.registerFormData['username'];
    this.validateField('username');
    if (this.isFieldInvalid('username')) {
      // Stop further processing if validation fails
      return;
    }

    callAPI(this.authService.isUserExist(user))
      .then((response:ApiResponse)=>{
        this.usernameExists = response.data;

        if (this.usernameExists) {
          this.errors['username'] = "El usuario ya existe"
        }
      })
      .catch((error:any) =>{
        console.log('Error checking username:', error);
        if (error.toastMessage) {
          this.messageService.add(error.toastMessage);
        }
      });

  }

  /**
   * Valida si un correo electrónico ya está registrado en el sistema.
   * @returns {void}
   */
  validateEmail():void{
    const user = this.registerFormData['email'];
    this.validateField('email');
    if (this.isFieldInvalid('email')) {
      // Stop further processing if validation fails
      return;
    }

    callAPI(this.authService.isEmailExist(user))
      .then((response:ApiResponse)=>{
        this.emailExists = response.data;
        if (this.emailExists) {
          this.errors['email'] = "El email ya existe"
        }

      })
      .catch((error:any) =>{
        console.log('Error checking username:', error);
        if (error.toastMessage) {
          this.messageService.add(error.toastMessage);
        }
      });

  }

  /**
   * Valida la edad del usuario con base en su fecha de nacimiento.
   * Requiere que el usuario sea mayor de 18 años.
   * @returns {void}
   */
  validateAge(){
    const birthdate = this.registerFormData['birthdate'];
    this.validateField('birthdate');
    if (this.isFieldInvalid('birthdate')) {
      // Stop further processing if validation fails
      return;
    }
    const inputValue = moment(birthdate, 'YYYY-MM-DD', true);
    const currentDate = moment();
    const age = currentDate.diff(inputValue, 'years')

    if (age < 18) {
      this.errors['birthdate'] = "Debes ser mayor de edad";
    } else {
      // Clear the error if validation passes
      delete this.errors['birthdate'];
    }

  }

  /**
   * Comprueba si un campo específico es inválido.
   * @param {string} fieldName - Nombre del campo a verificar.
   * @returns {boolean} `true` si el campo es inválido, de lo contrario `false`.
   */
  isFieldInvalid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Valida los datos del formulario y realiza la solicitud de inicio de sesión.
   */
  onLogin(): void {
    const user = this.convertFormDataToLoginUser();

    if (!this.isLoginFormValid()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos'});
      return;
    }

    callAPI(this.authService.doLogin(user))
      .then((response:ApiResponse)=>{
        if (response.status === 200 || response.status===2001){
          window.location.href= "/";
        }
      })
      .catch((error: any) => {
        this.messageService.add(error.toastMessage);
      });
  }

  /**
   * Limpia cualquier recurso o configuración al destruir el componente.
   * @returns {void}
   */
  ngOnDestroy() {
    removeFormBackground(this.renderer);
  }


}
