import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Menu } from "../../models/menu.model";
import { ApiService } from "../../services/api.service";
import { Restaurant } from "../../models/restaurant.model";
import { NewMenuRequest } from "../../models/requests/new-menu-request.model";

@Component({
    template: `
        <div *ngIf="!loading; else spinner" class="container">
            <div >
            <div class="notice" *ngIf="!isLinked && previouslyIsLinked">Menu cannot be relinked after save.</div>
            <div class="row justify-between">
                <mat-icon 
                *ngIf="canToggleLink() else link"
                class="icon pointer" 
                [ngClass]="isLinked ? 'primary' : ''" 
                (click)="toggleLink()"
                matTooltip="Link menu - data changed in one menu will be reflected in all linked menus"
                matTooltipPosition="after"
                matTooltipHideDelay="500"
                matTooltipShowDelay="500"
                aria-label="Link menu">
                    {{isLinked ? "link" : "link_off"}}
                </mat-icon>
                    <ng-template #link>
                        <mat-icon 
                        class="icon gray" 
                        matTooltip="Link menu - data changed in one menu will be reflected in all linked menus"
                        matTooltipPosition="after"
                        matTooltipHideDelay="500"
                        matTooltipShowDelay="500"
                        aria-label="Link menu">
                            link_off
                        </mat-icon>
                    </ng-template>
                    <mat-icon class="icon pointer" (click)="close()">close</mat-icon>
                </div>
                <div class="form">
                    <div class="form-data">
                        <label for="name">Name</label>
                        <input type="text" id="name" [formControl]="name"/>
                        <div *ngIf="formError !== ''" class="errors">{{formError}}</div>
                        <div class="restaurants">
                            Assign to:
                            <div *ngFor="let restaurant of allRestaurants" >
                                <input type="checkbox"
                                (change)="toggleRestaurant(restaurant)"
                                id="{{restaurant.id}}"
                                [value]="restaurant" 
                                [checked]="restaurantIsSelected(restaurant)"
                                />
                                <label for="{{restaurant.id}}">{{restaurant.name}}</label>
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
    selector: 'app-edit-menu-dialog',
    standalone: true,
    styleUrl: './new-edit-menu-dialog.component.scss',
    imports: [MatIconModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule]
})

export class EditMenuDialogComponent implements OnInit {
    formGroup: FormGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(50)
        ]),
        cloneOption: new FormControl({ value: '', disabled: true }),
        restaurants: new FormArray([], [
            Validators.required,
            Validators.minLength(1)
        ])
    });
    name: FormControl = this.formGroup.get('name') as FormControl;
    selectedOption: FormControl = this.formGroup.get('cloneOption') as FormControl;
    formError: string = '';
    allRestaurants: Restaurant[] = [];
    previouslyLinkedRestaurants: Restaurant[] = [];
    isLinked: boolean = false;
    previouslyIsLinked: boolean = false;

    loading: boolean = true;

    constructor(
        private apiService: ApiService,
        public dialogRef: MatDialogRef<EditMenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { menus: Menu[], restaurantId: number, activeMenuId: number }
    ) { }

    ngOnInit() {
        this.apiService.get(`/menu/getMenuDetails/${this.data.activeMenuId}`).subscribe((data: any) => {
            this.allRestaurants = data.allRestaurants;
            const restaurants = this.formGroup.get('restaurants') as FormArray;

            this.name.setValue(data.name);
            this.isLinked = data.isLinked;
            this.previouslyIsLinked = data.isLinked;
            this.previouslyLinkedRestaurants = data.linkedRestaurants;
            data.linkedRestaurants.forEach((restaurant: Restaurant) => {
                restaurants.push(new FormControl(restaurant));
            });

            this.loading = false;
        });
    }

    restaurantIsSelected(restaurant: Restaurant) {
        const formArray = this.formGroup.get('restaurants') as FormArray;
        const isSelected = formArray.value.find((r: Restaurant) => r.id === restaurant.id);
        return isSelected;
    }

    toggleRestaurant(restaurant: Restaurant) {
        const formArray = this.formGroup.get('restaurants') as FormArray;
        const restaurantExistsInArray = formArray.value.find((r: Restaurant) => r.id === restaurant.id);
        if (restaurantExistsInArray) {
            const index = formArray.value.findIndex((r: Restaurant) => r.id === restaurant.id);
            formArray.removeAt(index);
        } else {
            formArray.push(new FormControl(restaurant));
        }
    }

    
    toggleLink() {
        this.isLinked = !this.isLinked;
    }

    canToggleLink() {
        return this.formGroup.get('restaurants')?.value.length > 1 || this.previouslyIsLinked;
    }

    linkedRestaurantCount() {
        return 
    }

    submit() {
        if (this.formGroup.get('name')?.errors) {
            this.formError = 'Name must be between 1 and 50 characters';
            return;
        }

        if (this.formGroup.get('restaurants')?.errors) {
            this.formError = 'You must assign the menu to at least one restaurant';
            return;
        }

        const existingMenu = this.data.menus.find(m => m.id === this.data.activeMenuId);
        const menuNameIsSame = existingMenu?.name === this.name.value;

        const formArray = this.formGroup.get('restaurants') as FormArray;
        let restaurantsAreSame = false;
        if (formArray.value.length === this.previouslyLinkedRestaurants.length) {
            restaurantsAreSame = formArray.value.every((r: Restaurant) => this.previouslyLinkedRestaurants.includes(r));
        }
        const isLinkedIsSame = this.isLinked === this.previouslyIsLinked;

        if (menuNameIsSame && restaurantsAreSame && isLinkedIsSame) {
            this.dialogRef.close();
            return;
        }

        const request: NewMenuRequest = {
            id: this.data.activeMenuId,
            name: this.formGroup.get('name')?.value,
            cloneOptionId: 0,
            isLinked: this.isLinked,
            restaurantIds: this.formGroup.get('restaurants')?.value.map((r: Restaurant) => r.id),
            baseRestaurantId: this.data.restaurantId
        }

        this.apiService.post('/menu/update', request).subscribe((data: any) => {
            this.dialogRef.close(data);
        });

    }

    close() {
        this.dialogRef.close();
    }
}
