import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '@/page/page-not-found/page-not-found.component';
import {ViewAllEventsComponent} from '@/page/view-all-events/view-all-events.component';
import {EventDetailsComponent} from '@/page/event-details/event-details.component';
import {OrganizeEventComponent} from '@/page/organize-event/organize-event.component';
import {RegisterAndLoginComponent} from '@/page/register-and-login/register-and-login.component';
import {ProfileComponent} from '@/page/profile/profile.component';

export const routes: Routes = [
  {'path': '', 'component': ViewAllEventsComponent},
  {'path': 'event/:id', 'component': EventDetailsComponent},
  {'path': 'login', 'component': RegisterAndLoginComponent},
  {'path': 'register', 'component': RegisterAndLoginComponent},
  {'path': 'organize-event', 'component': OrganizeEventComponent},
  {'path': 'profile', 'component': ProfileComponent},
  {'path': '**', 'component': PageNotFoundComponent}
];
