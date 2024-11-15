import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {OrganizeEventComponent} from '../page/organize-event/organize-event.component';
import {EventDetailsComponent} from '../page/event-details/event-details.component';


export const routes: Routes = [
  {'path': 'event/:id', component: EventDetailsComponent},
  {'path': 'organize-event', 'component': OrganizeEventComponent},
  {'path': '**', 'component': PageNotFoundComponent}
];
