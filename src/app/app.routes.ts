import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage.component';
import { OwnerDashboardComponent } from './components/owners/owner-dashboard/owner-dashboard.component';
import { OwnerRestaurantComponent } from './components/owners/owner-dashboard/owner-restaurant/owner-restaurant.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'owners', component: OwnerDashboardComponent},
    { path: 'owners/restaurant/:id', component: OwnerRestaurantComponent}
];
