import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {RegisterAndLoginComponent} from '../page/register-and-login/register-and-login.component';
import {EventDetailsComponent} from '../page/event-details/event-details.component';
import {ToggleComponent} from '../toggle/toggle.component';



export const routes: Routes = [
  {'path': 'login', component: RegisterAndLoginComponent},
  {'path': 'register', component: RegisterAndLoginComponent},
  {'path': 'event/:id', component: EventDetailsComponent},
  {'path': 'toggle', component: ToggleComponent},
  {'path': '**', 'component': PageNotFoundComponent},
];
