import { Component, Input, OnInit } from "@angular/core";
import { MenuItem } from "../../models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Allergen } from "../../models/allergen.model";
import { MenuItemGroup } from "../../models/menu-item-group.model";

@Component({
    template: `
        <div class="container" *ngIf="menuItemGroup">
            <div *ngIf="menuItemGroup.isEditMode; else nameDisplay" class="group-header">
                <div class="group-input">
                    <label for="{{menuItemGroup.uuid + 'name'}}">Group Name</label>
                    <input 
                        type="text" 
                        [(ngModel)]="menuItemGroup.name"
                        id="{{menuItemGroup.uuid + 'name'}}"
                        placeholder="Drinks, Lunch, ect..."/>
                        <div class="edit-icon">
                            <div class="error">{{menuItemGroup.groupNameError}}</div>
                            <mat-icon (click)="toggleEditName()">done</mat-icon>
                        </div>
                </div>
            </div>
            <ng-template #nameDisplay >
                <div class="group-name-display">
                    <h2>{{menuItemGroup.name}}</h2>
                    <mat-icon>edit</mat-icon>
                </div>
            </ng-template>
            <div [ngClass]="menuItem.isEditMode ? 'menu-item-edit' : 'menu-item-display'" *ngFor="let menuItem of menuItemGroup.menuItems; index as i">
                <div *ngIf="menuItem.isEditMode; else display" class="menu-item-info">
                    <div class="text-fields">
                        <div class="input-line">
                            <label for="{{menuItem.uuid + i + 'name'}}">Name</label>
                            <input type="text" id="{{menuItem.uuid + i + 'name'}}" [(ngModel)]="menuItem.name" />
                            <div *ngIf="menuItem.nameError" class="error">
                                {{menuItem.nameError}}
                            </div>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + i + 'description'}}">Description</label>
                            <textarea id="{{menuItem.uuid + i + 'description'}}" [(ngModel)]="menuItem.description"> </textarea>
                            <div *ngIf="menuItem.descriptionError" class="error">
                                {{menuItem.descriptionError}}
                            </div>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + i + 'extraDetails'}}">Extra Details</label>
                            <textarea id="{{menuItem.uuid + i + 'extraDetails'}}" [(ngModel)]="menuItem.extraDetails"> </textarea>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + i + 'price'}}">Price</label>
                            <input type="text" id="{{menuItem.uuid + i + 'price'}}" [(ngModel)]="menuItem.price" />
                        </div>
                        <label for="{{menuItem.uuid + i + 'allergens'}}">Allergens</label>
                    </div>
                    <div class="allergens">
                        <span *ngFor="let allergen of allergens" id="{{menuItem.uuid + i + 'allergens'}}" class="allergen">
                            <input type="checkbox" (change)="toggleAllergen(menuItem, allergen)" [checked]="containsAllergen(menuItem, allergen)"/>
                            <label>{{allergen.name}}</label>
                        </span>
                    </div>
                    <div class="menu-item-edit-toggle-row">
                        <mat-icon class="pointer" (click)="toggleEditMode(menuItem)">check_circle</mat-icon>
                    </div>
                </div>
                <ng-template #display>
                    <div>{{menuItem.name}}</div>
                    <div>{{menuItem.description}}</div>
                    <div>{{menuItem.extraDetails}}</div>
                    <div>{{menuItem.price}}</div>
                    <div *ngFor="let allergen of menuItem.allergens">{{allergen.name}}</div>
                    <div class="menu-item-edit-toggle-row">
                        <mat-icon class="pointer" (click)="toggleEditMode(menuItem)">edit</mat-icon>
                    </div>
                </ng-template>
            </div>
        </div>

        <div class="divider"></div>
    `,
    selector: 'app-menu-item-group',
    standalone: true,
    styleUrl: './menu-item-group.component.scss',
    imports: [MatIconModule, CommonModule, ReactiveFormsModule, FormsModule]
})

export class MenuItemGroupComponent {
    @Input() groupUuid: string = '';
    @Input() allergens: any[] = [];
    @Input() menuItemGroup: MenuItemGroup | undefined;
    @Input() checkForErrors: Function = () => { return false };

    constructor() {
    }

    containsAllergen(menuItem: MenuItem, allergen: Allergen) {
        const contains = menuItem.allergens.find((a) => a.id === allergen.id);
        return contains;
    }

    toggleAllergen(menuItem: MenuItem, allergen: Allergen) {
        menuItem.allergens.includes(allergen) ? menuItem.allergens.splice(menuItem.allergens.indexOf(allergen), 1) : menuItem.allergens.push(allergen);
    }

    toggleEditMode(menuItem: MenuItem) {
        menuItem.nameError = this.checkForErrors(menuItem.name, 1, 50) ? 'Name must be between 1 and 50 characters' : '';
        menuItem.descriptionError = this.checkForErrors(menuItem.description, 1, 500) ? 'Description must be between 1 and 500 characters' : '';

        if (menuItem.nameError === '' && menuItem.descriptionError === '') {
            menuItem.isEditMode = !menuItem.isEditMode;
        }
    }

    toggleEditName() {
        if (!this.menuItemGroup) {
            return;
        }
        this.menuItemGroup.groupNameError = this.checkForErrors(this.menuItemGroup?.name, 1, 50) ? 'Name must be between 1 and 50 characters' : '';
        if (this.menuItemGroup.groupNameError === '') {
            this.menuItemGroup.isEditMode = !this.menuItemGroup.isEditMode
        }
    }
}