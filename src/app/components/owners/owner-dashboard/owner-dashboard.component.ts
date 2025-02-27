import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Restaurant } from '../../../models/restaurant.model';
import { CommonCardComponent } from "../../common/common-card.component";
import { Utils } from '../../../services/utils';
import { MatDialog } from '@angular/material/dialog';
import { NewEditRestaurantDialogComponent } from '../../dialogs/new-edit-restaurant-dialog.component';
import Swal from 'sweetalert2';

@Component({
  template: `
    <div class="container">
      <div class="grid">
        <button class="add-restaurant" (click)="openRestaurantModal()" >
          add location
        </button>
        <app-common-card 
        *ngFor="let restaurant of restaurants" 
        [title]="restaurant.name"
        [details]="getDetails(restaurant)"
        [routeURI]="'/owners/restaurant'"
        [id]="restaurant.id"
        (editItem)="openRestaurantModal($event)"
        (deleteItem)="deleteRestaurant($event)"
        />
      </div>
    </div>
  `,
  selector: 'app-owner-dashboard',
  standalone: true,
  styleUrls: ['./owner-dashboard.component.scss', '../../common/scss-files/common-dashboard.component.scss'],
  imports: [CommonModule, CommonCardComponent]
})
export class OwnerDashboardComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.apiService.get('/restaurant/all').subscribe((data: any) => {
      this.restaurants = data;
    });
  }

  getDetails(restaurant: Restaurant) {
    const streetLine = restaurant.streetAddressTwo ? `${restaurant.streetAddress}, ${restaurant.streetAddressTwo}` : restaurant.streetAddress;
    return [
      restaurant.details,
      streetLine,
      `${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`,
      Utils.formatPhoneNumber(restaurant.phoneNumber)
    ];
  }

  openRestaurantModal(event?: number) {
    const restaurantIndex = this.restaurants.findIndex((restaurant: Restaurant) => restaurant.id === event);

    this.dialog.open(NewEditRestaurantDialogComponent, {
      minHeight: '500px',
      minWidth: '500px',
      height: 'auto',
      width: 'auto',
      data: {
        restaurant: this.restaurants[restaurantIndex]
      }
    }).afterClosed().subscribe((data: any) => {
      if (!data) {
        return;
      };
      if (restaurantIndex > -1) {
        this.restaurants[restaurantIndex] = data;
      } else {
        this.restaurants.push(data);
      }
    });
  }

  deleteRestaurant(id: number) {
    Swal.fire({

      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'

    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`/restaurant/${id}`).subscribe(() => {
          this.restaurants = this.restaurants.filter((restaurant: Restaurant) => restaurant.id !== id);
        });
        Swal.fire(
          'Deleted!',
          'success'
        )
      }
    })
  }

}