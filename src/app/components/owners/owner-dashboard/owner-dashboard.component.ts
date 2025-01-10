import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Restaurant } from '../../../models/restaurant.model';
import { CommonCardComponent } from "../../common/common-card.component";
import { Utils } from '../../../services/utils';

@Component({
  template: `
    <div class="header">
      Add welcome message or something similar
    </div>
    <div class="container">
      <div class="row">
        <app-common-card 
        *ngFor="let restaurant of restaurants" 
        [title]="restaurant.name"
        [details]="getDetails(restaurant)"
        [routeURI]="'/owners/restaurant'"
        [id]="restaurant.id"
        />
      </div>
    </div>
  `,
  selector: 'app-owner-dashboard',
  standalone: true,
  styleUrl: './owner-dashboard.component.scss',
  imports: [CommonModule, CommonCardComponent]
})
export class OwnerDashboardComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.get('/restaurant/all').subscribe((data: any) => {
      this.restaurants = data;
    });
  }

  getDetails(restaurant: Restaurant) {
    return [
      restaurant.streetAddress,
      `${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`,
      Utils.formatPhoneNumber(restaurant.phoneNumber)
    ];
  }

}