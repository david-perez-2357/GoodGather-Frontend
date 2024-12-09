import {Component, OnDestroy, OnInit, Renderer2, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {StaticValidationRules, validateField} from '@/method/validate-methods';
import {LocationService} from '@/service/LocationService';
import {CauseService} from '@/service/CauseService';
import {MessageService} from 'primeng/api';
import {callAPI} from '@/method/response-mehods';
import Cause from '@/interface/Cause';
import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"
import {NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import AppUser from '@/interface/AppUser';
import {AppService} from '@/service/AppService';

UC.defineComponents(UC);

@Component({
  selector: 'app-create-cause-dialog',
  standalone: true,
  imports: [
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextareaModule,
    NgIf,
    InputTextModule,
    ButtonDirective
  ],
  templateUrl: './create-cause-dialog.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateCauseDialogComponent implements OnInit, OnDestroy {
  createCauseProcessDialogVisible: boolean = false;
  formData: { [key: string]: any } = {
    name: '',
    description: '',
    image: '',
    deleted: 0,
    scope: ''
  };
  activeUser: AppUser = {} as AppUser;
  errors: { [key: string]: string } = {};
  Scopes: any[] = [
    { name: 'Global', code: 'GLOBAL' },
    { name: 'Nacional', code: 'NATIONAL' },
    { name: 'Local', code: 'LOCAL' }
  ];

  fieldRules: { [key: string]: any[] } = {
    name: [StaticValidationRules['required']],
    description: [StaticValidationRules['required']],
    image: [StaticValidationRules['required']],
    scope: [StaticValidationRules['required']]
  };

  constructor(private renderer: Renderer2, private appService: AppService, private locationService: LocationService, private causeService: CauseService, private messageService: MessageService) {}
  @Output() causeCreated = new EventEmitter<Cause>();

  ngOnInit(): void {
    this.initializeImageUpdater();
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

  ngOnDestroy(): void {}

  initializeImageUpdater(): void {
    setInterval(() => {
      this.updateImageFromDOM();
      this.updateUploaderText('#my-uploader span', 'Subir imagen');
    }, 1500);
  }

  updateImageFromDOM(): void {
    const imageElement = document.querySelector('.uc-thumb');
    const styleAttribute = imageElement?.getAttribute('style');
    const imageSrc = styleAttribute?.split(' ')[1]?.slice(5, -2)?.split('-/')[0];

    if (imageSrc) {
      this.formData['image'] = imageSrc;
    }
  }

  updateUploaderText(selector: string, text: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = text;
    }
  }

  validateField(fieldName: string): void {
    const value = this.formData[fieldName];
    const rules = this.fieldRules[fieldName];
    this.errors[fieldName] = rules? validateField(value, rules) || '':'';
  }

  isFieldInvalid(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  onImageError($event: ErrorEvent): void {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }

  onSubmit(): void {
    const cause = this.convertFormDataToCause();
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos' });
      return;
    }
    callAPI(this.causeService.createCause(cause))
      .then((response: any) => {
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Causa creada con éxito' });
          this.createCauseProcessDialogVisible = false;
          this.causeCreated.emit(response.data);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la causa' });
        }
      })
      .catch((error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la causa' });
      });
  }

  isFormValid(): boolean {
    return Object.keys(this.formData).every((key) => this.formData[key] !== '' && !this.isFieldInvalid(key));
  }

  convertFormDataToCause(): Cause {
    return {
      id: 0,
      name: this.formData['name'],
      description: this.formData['description'],
      image: this.formData['image'],
      scope: this.formData['scope'],
      idOwner: this.activeUser.id,
    };
  }

  openDialog() {
    this.createCauseProcessDialogVisible = true;
  }
}
