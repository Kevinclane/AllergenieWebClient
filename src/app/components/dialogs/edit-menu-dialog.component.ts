import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Menu } from "../../models/menu.model";
import { ApiService } from "../../services/api.service";
import { NewMenuDialogComponent } from "./new-menu-dialog.component";
import { Restaurant } from "../../models/restaurant.model";
import { NewMenuRequest } from "../../models/requests/new-menu-request.model";

@Component({
    template: `
        <div *ngIf="!loading; else spinner" class="container">
            <div >
                <div class="row justify-end">
                    <mat-icon class="close" (click)="close()">close</mat-icon>
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

    submit() {
        if (this.formGroup.get('name')?.errors) {
            this.formError = 'Name must be between 1 and 50 characters';
            return;
        }

        const existingNames = this.data.menus.map(m => m.name && m.id !== this.data.activeMenuId);
        if (existingNames.includes(this.formGroup.get('name')?.value)) {
            this.formError = 'This name already exists';
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

        if (menuNameIsSame && restaurantsAreSame) {
            this.dialogRef.close();
            return;
        }

        const request: NewMenuRequest = {
            id: this.data.activeMenuId,
            name: this.formGroup.get('name')?.value,
            cloneOption: this.formGroup.get('cloneOption')?.disabled ?
                0 :
                parseInt(this.formGroup.get('cloneOption')?.value),
            restaurantIds: this.formGroup.get('restaurants')?.value.map((r: Restaurant) => r.id)
        }

        this.apiService.post('/menu/update', request).subscribe((data: any) => {
            this.dialogRef.close(data);
        });

    }

    close() {
        this.dialogRef.close();
    }
}
