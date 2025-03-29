import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Menu } from "../../models/menu.model";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../services/api.service";
import { Restaurant } from "../../models/restaurant.model";
import { NewEditMenuResponse } from "../../models/responses/new-edit-menu-response.model";
import { NewMenuRequest } from "../../models/requests/new-menu-request.model";

@Component({
    template: `
        <div *ngIf="!loading; else spinner" class="container">
            <div >
                <div class="row justify-between">
                    <mat-icon 
                    *ngIf="linkedRestaurantCount() <= 1 else link"
                    class="icon gray" 
                    matTooltip="Link menu - data changed in one menu will be reflected in all linked menus"
                    matTooltipPosition="after"
                    matTooltipHideDelay="500"
                    matTooltipShowDelay="500"
                    aria-label="Link menu"
                    >link_off</mat-icon>
                    <ng-template #link>
                        <mat-icon 
                        class="icon pointer" 
                        [ngClass]="isLinked ? 'primary' : ''" 
                        (click)="toggleLink()"
                        matTooltip="Link menu - data changed in one menu will be reflected in all linked menus"
                        matTooltipPosition="after"
                        matTooltipHideDelay="500"
                        matTooltipShowDelay="500"
                        aria-label="Link menu"
                        >{{isLinked ? "link" : "link_off"}}</mat-icon>
                    </ng-template>
                    <!-- add tooltip -->
                    <mat-icon class="icon pointer" (click)="close()">close</mat-icon>
                </div>
                <div class="form">
                    <div class="form-data">
                        <div class="clone-toggle-container">
                            <div>
                                Clone from existing menu: 
                            </div>
                            <label for="cloneMenu" class="switch">
                                <input type="checkbox" id="cloneMenu" (click)="toggleSlider()"/>
                                <span class="slider round"></span>
                            </label>
                            <div *ngIf="formError !== ''" class="errors">{{formError}}</div>
                        </div>
                        <div *ngIf="restaurantCloneSelection.disabled else cloneOptionsContainer">
                            <label for="name">Name</label>
                            <input type="text" id="name" [formControl]="name"/>
                        </div>

                        <ng-template #cloneOptionsContainer class="clone-options-container">
                            <label for="clone-options-restauraunt">Restaurant</label>
                                <select 
                                name="clone-options-restauraunt" 
                                id="clone-options-restauraunt" 
                                [formControl]="restaurantCloneSelection">
                                    <option 
                                    *ngFor="let restaurant of allRestaurants" 
                                    id="{{restaurant.id}}" 
                                    [value]="restaurant.id">
                                        {{restaurant.name}}
                                    </option>
                                </select>    
                            <label for="clone-options-menu">Menu</label>
                                <select 
                                name="clone-options-menu" 
                                id="clone-options-menu" 
                                [formControl]="menuCloneSelection">
                                    <option 
                                    *ngFor="let menu of selectedRestaurantsMenus" 
                                    id="{{menu.id}}" 
                                    [value]="menu.id">
                                        {{menu.name}}
                                    </option>
                                </select>
                        </ng-template>
                        <div class="restaurants">
                            Assign to:
                            <div *ngFor="let restaurant of allRestaurants" >
                                <input type="checkbox"
                                (change)="toggleRestaurant(restaurant)"
                                id="restaurant-{{restaurant.id}}"
                                [value]="restaurant" 
                                [checked]="restaurantIsSelected(restaurant)"
                                />
                                <label for="restaurant-{{restaurant.id}}">{{restaurant.name}}</label>
                            </div>
                        </div>
                    </div>
                    <button class="button-primary" (click)="submit()">Submit</button>         
                </div>
            </div>
        </div>
        <ng-template #spinner>
            <div class="spinner-container">
                <mat-spinner diameter="50"></mat-spinner>
            </div>
        </ng-template>
    `,
    selector: 'app-new-edit-menu-dialog',
    standalone: true,
    styleUrl: './new-edit-menu-dialog.component.scss',
    imports: [MatIconModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatTooltipModule]
})

export class NewMenuDialogComponent implements OnInit {
    formGroup: FormGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(50)
        ]),
        restaurantCloneSelection: new FormControl({ value: '', disabled: true }, Validators.required),
        menuCloneSelection: new FormControl({ value: '', disabled: true }, Validators.required),
        restaurants: new FormArray([], [
            Validators.required,
            Validators.minLength(1)
        ])
    });
    name: FormControl = this.formGroup.get('name') as FormControl;
    menuCloneSelection: FormControl = this.formGroup.get('menuCloneSelection') as FormControl;
    restaurantCloneSelection: FormControl = this.formGroup.get('restaurantCloneSelection') as FormControl;
    formError: string = '';
    allRestaurants: Restaurant[] = [];
    selectedRestaurantsMenus: Menu[] = [];
    loading: boolean = true;
    isLinked: boolean = false;

    constructor(
        private _apiService: ApiService,
        public dialogRef: MatDialogRef<NewMenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { menus: Menu[], restaurantId: number }
    ) {
        this.restaurantCloneSelection.valueChanges.subscribe((value: string) => {
            if (value) {
                this.getMenusByRestaurant(parseInt(value));
            }
        });
    }

    ngOnInit(): void {
        this._apiService.get(`/menu/getMenuDetails/0`).subscribe((data: NewEditMenuResponse) => {
            this.allRestaurants = data.allRestaurants;
            const restaurants = this.formGroup.get('restaurants') as FormArray;

            const currentRestaurant = this.allRestaurants.find((r: Restaurant) => r.id == this.data.restaurantId);
            restaurants.push(new FormControl(currentRestaurant));

            this.loading = false;
        });
    }

    getMenusByRestaurant(restaurantId: number) {
        this._apiService.get(`/menu/all/${restaurantId}`).subscribe((data: Menu[]) => {
            this.selectedRestaurantsMenus = data;
            this.menuCloneSelection.enable();
        });
    }

    restaurantIsSelected(restaurant: Restaurant) {
        const formArray = this.formGroup.get('restaurants') as FormArray;
        return formArray.value.includes(restaurant);
    }

    toggleSlider() {
        this.restaurantCloneSelection.disabled ?
            this.restaurantCloneSelection.enable() :
            this.restaurantCloneSelection.disable();
    }

    toggleRestaurant(restaurant: Restaurant) {
        const formArray = this.formGroup.get('restaurants') as FormArray;

        if (formArray.value.includes(restaurant)) {
            formArray.removeAt(formArray.value.indexOf(restaurant));
        } else {
            formArray.push(new FormControl(restaurant));
        }
    }

    toggleLink() {
        this.isLinked = !this.isLinked;
    }

    linkedRestaurantCount() {
        return this.formGroup.get('restaurants')?.value.length;
    }

    submit() {
        let error = '';
        if (this.restaurantCloneSelection.enabled) {
            if (this.menuCloneSelection.errors || this.restaurantCloneSelection.errors) {
                error = 'You must select a menu to clone from';
            }
        } else {
            if (this.formGroup.get('name')?.errors) {
                error = 'Name must be between 1 and 50 characters';
            }
        }

        if (this.formGroup.get('restaurants')?.errors) {
            error = 'You must assign the menu to at least one restaurant';
        }

        this.formError = error;

        if (!this.formError) {
            const request: NewMenuRequest = {
                id: 0,
                name: this.formGroup.get('name')?.value,
                cloneOptionId: this.menuCloneSelection.disabled ?
                    0 :
                    parseInt(this.menuCloneSelection.value),
                isLinked: this.isLinked && this.linkedRestaurantCount() > 1,
                restaurantIds: this.formGroup.get('restaurants')?.value.map((r: Restaurant) => r.id)
            }

            this._apiService.post('/menu/create', request).subscribe((data: any) => {
                this.dialogRef.close(data);
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

}