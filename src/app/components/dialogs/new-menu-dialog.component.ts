import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { Menu } from "../../models/menu.model";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../services/api.service";
import { Restaurant } from "../../models/restaurant.model";

@Component({
    template: `
        <div class="container">
            <div class="row justify-end">
                <mat-icon class="close" (click)="close()">close</mat-icon>
            </div>
            <div class="form">
                <div class="form-data">
                    <label for="name">Name</label>
                    <input type="text" id="name" [formControl]="name"/>
                    <div *ngIf="formError !== ''" class="errors">{{formError}}</div>
                    <div [hidden]="data.menus.length === 0">
                        <label for="cloneMenu" class="switch">
                            <input type="checkbox" id="cloneMenu" (click)="toggleCheckbox()"/>]>
                            <span class="slider round"></span>
                        </label>
                        <div >
                            Clone from: 
                        </div>
                        <select 
                            name="clone-options" 
                            id="clone-options" 
                            [formControl]="selectedOption">
                                <option 
                                *ngFor="let menu of data.menus" 
                                id="{{menu.id}}" 
                                [value]="menu.id">
                                    {{menu.name}}
                                </option>
                        </select>
                    </div>
                    <div class="restaurants">
                        Assign to:
                        <div *ngFor="let restaurant of allRestaurants" >
                            <input type="checkbox"
                            (change)="toggleRestaurant(restaurant)"
                            id="{{restaurant.id}}"
                            [value]="restaurant" 
                            [checked]="formGroup.get('restaurants')?.value.includes(restaurant)"
                            />
                            <label for="{{restaurant.id}}">{{restaurant.name}}</label>
                        </div>
                    </div>
                </div>
                <button class="button-primary" (click)="submit()">Submit</button>         
            </div>
        </div>
    `,
    selector: 'app-new-menu-dialog',
    standalone: true,
    styleUrl: './new-menu-dialog.component.scss',
    imports: [MatIconModule, ReactiveFormsModule, CommonModule]
})

export class NewMenuDialogComponent implements OnInit{
    formGroup: FormGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(50)
        ]),
        cloneOption: new FormControl({value: '', disabled: true}),
        restaurants: new FormArray([], [
            Validators.required,
            Validators.minLength(1)            
        ])
    });
    name: FormControl = this.formGroup.get('name') as FormControl;
    selectedOption: FormControl = this.formGroup.get('cloneOption') as FormControl;
    formError: string = '';
    allRestaurants: Restaurant[] = [];

    constructor(
        private apiService: ApiService,
        public dialogRef: MatDialogRef<NewMenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { menus: Menu[], restaurantId: number }
    ) { }

    ngOnInit(): void {
        this.apiService.get('/restaurant/all').subscribe((data: any) => {
            this.allRestaurants = data;

            const formArray = this.formGroup.get('restaurants') as FormArray;
            const currentRestaurant = data.find((r: Restaurant) => r.id == this.data.restaurantId);
            formArray.push(new FormControl(currentRestaurant));
        });
    }

    toggleCheckbox() {
        this.formGroup.get('cloneOption')?.disabled ?        
        this.formGroup.get('cloneOption')?.enable() :         
        this.formGroup.get('cloneOption')?.disable();
    }

    toggleRestaurant(restaurant: Restaurant) {
        const formArray = this.formGroup.get('restaurants') as FormArray;
        if(formArray.value.includes(restaurant)) {
            formArray.removeAt(formArray.value.indexOf(restaurant));
        } else {
            formArray.push(new FormControl(restaurant));
        }
    }

    submit() {
        if(this.formGroup.get('name')?.errors) {
            this.formError = 'Name must be between 1 and 50 characters';
            return;
        }

        const existingNames = this.data.menus.map(m => m.name);
        if(existingNames.includes(this.formGroup.get('name')?.value)) {
            this.formError = 'This name already exists';
            return;
        }

        if(this.formGroup.get('restaurants')?.errors) {
            this.formError = 'You must assign the menu to at least one restaurant';
            return;
        }

        const request = {
            name: this.formGroup.get('name')?.value,
            cloneOption: this.formGroup.get('cloneOption')?.disabled ? 
                0 : 
                parseInt(this.formGroup.get('cloneOption')?.value),
            restaurantIds: this.formGroup.get('restaurants')?.value.map((r: Restaurant) => r.id)
        }
        this.apiService.post('/menu/create', request).subscribe((data: any) => {
            this.dialogRef.close(data);
        });

    }

    close() {
        this.dialogRef.close();
    }

}