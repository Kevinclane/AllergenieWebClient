import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Restaurant } from "../../models/restaurant.model";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService } from "../../services/api.service";

@Component({
    template: `
    <div class="container">
        <div class="form">
            <div class="col">
                <div class="input-group">
                    <label for="name">Name</label>
                    <input type="text" [formControl]="name" id="name" required="true">
                    <div *ngIf="nameError" class="error">{{nameError}}</div>
                </div>
                <div class="input-group">
                    <label for="details">Details</label>
                    <input type="text" [formControl]="details" id="details" >
                    <div *ngIf="detailsError" class="error">{{detailsError}}</div>
                    <!-- add tooltip explainin this field is hidden and for easier distinction only -->
                </div>
                <div class="input-group">
                    <label for="phoneNumber">Phone Number</label>
                    <input type="text" [formControl]="phoneNumber" id="phoneNumber">
                    <div *ngIf="phoneNumberError" class="error">{{phoneNumberError}}</div>
                </div>
                <div class="input-group">
                    <label for="emailAddress">Email Address</label>
                    <input type="text" [formControl]="emailAddress" id="emailAddress">
                    <div *ngIf="emailAddressError" class="error">{{emailAddressError}}</div>
                </div>
            </div>

            <div class="col">
                <div class="input-group">
                    <label for="streetAddress">Street Address</label>
                    <input type="text" [formControl]="streetAddress" id="streetAddress" required="true">
                    <div *ngIf="streetAddressError" class="error">{{streetAddressError}}</div>
                </div>
                <div class="input-group">
                    <label for="streetAddressTwo">Street Address Two</label>
                    <input type="text" [formControl]="streetAddressTwo" id="streetAddressTwo">
                    <div *ngIf="streetAddressTwoError" class="error">{{streetAddressTwoError}}</div>
                </div>
                <div class="input-group">
                    <label for="city">City</label>
                    <input type="text" [formControl]="city" id="city" required="true">
                    <div *ngIf="cityError" class="error">{{cityError}}</div>
                </div>
                <div class="input-group">
                    <label for="state">State</label>
                    <select id="state" [formControl]="state">
                        <option value="{{state}}" *ngFor="let state of states">
                            {{state}}
                        </option>
                    </select>
                    <div *ngIf="stateError" class="error">{{stateError}}</div>
                </div>
                <div class="input-group">
                    <label for="zipCode">Zip Code</label>
                    <input type="text" [formControl]="zipCode" id="zipCode" required="true">
                    <div *ngIf="zipCodeError" class="error">{{zipCodeError}}</div>
                </div>
            </div>
        </div>
        <div class="button-group">
            <button (click)="cancel()" class="button-danger">Cancel</button>
            <button (click)="submit()" class="button-primary">Submit</button>
        </div>
    </div>
    `,
    selector: 'app-new-edit-restaurant-dialog',
    standalone: true,
    styleUrl: './new-edit-restaurant-dialog.component.scss',
    imports: [MatIconModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule]
})

export class NewEditRestaurantDialogComponent {
    name: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
    ]);
    details: FormControl = new FormControl('', [
        Validators.minLength(1),
        Validators.maxLength(50)
    ]);
    phoneNumber: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')
    ]);
    emailAddress: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.email
    ]);
    streetAddress: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]);
    streetAddressTwo: FormControl = new FormControl('', [
        Validators.minLength(1),
        Validators.maxLength(20)
    ]);
    city: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(45)
    ]);
    state: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2)
    ]);
    zipCode: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]*$')
    ]);

    formGroup: FormGroup = new FormGroup({
        name: this.name,
        details: this.details,
        phoneNumber: this.phoneNumber,
        emailAddress: this.emailAddress,
        streetAddress: this.streetAddress,
        streetAddressTwo: this.streetAddressTwo,
        city: this.city,
        state: this.state,
        zipCode: this.zipCode,
    });

    nameError: string = '';
    detailsError: string = '';
    phoneNumberError: string = '';
    emailAddressError: string = '';
    streetAddressError: string = '';
    streetAddressTwoError: string = '';
    cityError: string = '';
    stateError: string = '';
    zipCodeError: string = '';

    id: number = 0;

    states: string[] = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    constructor(
        private _apiService: ApiService,
        public dialogRef: MatDialogRef<NewEditRestaurantDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant }
    ) {
        if (data.restaurant) {
            this.formGroup.patchValue(data.restaurant);
            this.id = data.restaurant.id;
        };

        this.formGroup.get('state')?.valueChanges.subscribe((value: string) => {
            if (value.length > 2) {
                this.formGroup.get('state')?.setValue(value.slice(0, 2));
            }
        });

        this.formGroup.get('zipCode')?.valueChanges.subscribe((value: string) => {
            if (value.length > 5) {
                this.formGroup.get('zipCode')?.setValue(value.slice(0, 5));
            }
        });

        this.formGroup.get('phoneNumber')?.valueChanges.subscribe((value: string) => {
            const cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue !== value) {
                this.formGroup.get('phoneNumber')?.setValue(cleanedValue);
            }
            if (cleanedValue.length > 10) {
                this.formGroup.get('phoneNumber')?.setValue(cleanedValue.slice(0, 10));
            }
        });
    }

    submit() {
        if (!this.formGroup.valid) {
            this.nameError = this.checkInput(this.name);
            this.detailsError = this.checkInput(this.details);
            this.phoneNumberError = this.checkInput(this.phoneNumber);
            this.emailAddressError = this.checkInput(this.emailAddress);
            this.streetAddressError = this.checkInput(this.streetAddress);
            this.streetAddressTwoError = this.checkInput(this.streetAddressTwo);
            this.cityError = this.checkInput(this.city);
            this.stateError = this.checkInput(this.state);
            this.zipCodeError = this.checkInput(this.zipCode);
        } else {
            const request: Restaurant = {
                id: this.id,
                name: this.name.value,
                details: this.details.value,
                phoneNumber: this.phoneNumber.value,
                emailAddress: this.emailAddress.value,
                streetAddress: this.streetAddress.value,
                streetAddressTwo: this.streetAddressTwo.value,
                city: this.city.value,
                state: this.state.value,
                zipCode: this.zipCode.value
            }
            this._apiService.post('/restaurant/save', request).subscribe((data: any) => {
                this.dialogRef.close(data);
            });
        }
    }

    checkInput(control: FormControl) {
        if (control.hasError('required')) {
            return 'This field is required';
        } else if (control.hasError('minlength')) {
            return 'This field must be at least ' + control.errors?.["minlength"].requiredLength + ' characters';
        } else if (control.hasError('maxlength')) {
            return 'This field must be less than ' + control.errors?.["maxlength"].requiredLength + ' characters';
        } else if (control.hasError('pattern')) {
            return 'This field must be a number';
        } else if (control.hasError('email')) {
            return 'This field must be a valid email address';
        }
        return '';
    }

    cancel() {
        this.dialogRef.close();
    }
}