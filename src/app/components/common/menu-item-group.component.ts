import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MenuItem } from "../../models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Allergen } from "../../models/allergen.model";
import { MenuItemGroup } from "../../models/menu-item-group.model";
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
    template: `
        <div class="container" 
        *ngIf="menuItemGroup"
        cdkDropList
        [id]="menuItemGroup.uuid"
        [cdkDropListData]="menuItemGroup.menuItems"
        [cdkDropListConnectedTo]="groupUuids"
        (cdkDropListDropped)="drop($event)">
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
            @for (menuItem of menuItemGroup.menuItems; track menuItem) {
                <div [ngClass]="menuItem.isEditMode ? 'menu-item-edit' : 'menu-item-display'" 
                id="{{menuItem.uuid}}"
                cdkDrag>
                <div class="image-container"></div>
                <div *ngIf="menuItem.isEditMode; else display" class="menu-item-info">
                    <div class="text-fields">
                        <div class="input-line">
                            <label for="{{menuItem.uuid + menuItem.position + 'name'}}">Name</label>
                            <input type="text" id="{{menuItem.uuid + menuItem.position + 'name'}}" [(ngModel)]="menuItem.name" (ngModelChange)="setDataChanged(true)"/>
                            <div *ngIf="menuItem.nameError" class="error">
                                {{menuItem.nameError}}
                            </div>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + menuItem.position + 'description'}}">Description</label>
                            <textarea id="{{menuItem.uuid + menuItem.position + 'description'}}" [(ngModel)]="menuItem.description" (ngModelChange)="setDataChanged(true)"> </textarea>
                            <div *ngIf="menuItem.descriptionError" class="error">
                                {{menuItem.descriptionError}}
                            </div>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + menuItem.position + 'extraDetails'}}">Extra Details</label>
                            <textarea id="{{menuItem.uuid + menuItem.position + 'extraDetails'}}" [(ngModel)]="menuItem.extraDetails" (ngModelChange)="setDataChanged(true)"> </textarea>
                        </div>
                        <div class="input-line">
                            <label for="{{menuItem.uuid + menuItem.position + 'price'}}">Price</label>
                            <input type="text" id="{{menuItem.uuid + menuItem.position + 'price'}}" [(ngModel)]="menuItem.price" (ngModelChange)="setDataChanged(true)"/>
                        </div>
                        <div>Allergens</div>
                    </div>
                    <div class="allergens">
                        <span *ngFor="let allergen of allergens" class="allergen">
                            <input 
                            type="checkbox" 
                            (change)="toggleAllergen(menuItem, allergen)" 
                            [checked]="containsAllergen(menuItem, allergen)"
                            id="{{menuItem.uuid + menuItem.position + allergen.id}}"/>
                            <label for="{{menuItem.uuid + menuItem.position + allergen.id}}">{{allergen.name}}</label>
                        </span>
                    </div>
                    <div class="menu-item-edit-toggle-row">
                        <mat-icon class="pointer" (click)="toggleEditMode(menuItem)">check_circle</mat-icon>
                    </div>
                </div>
                <ng-template #display>
                    <div class="menu-item-display-info">
                        <div>{{menuItem.name}}</div>
                        <div>{{menuItem.description}}</div>
                        <div>{{menuItem.extraDetails}}</div>
                        <div>{{menuItem.price}}</div>
                        <div *ngFor="let allergen of menuItem.allergens">{{allergen.name}}</div>
                    </div>
                </ng-template>
                <div class="icon-group" *ngIf="!menuItem.isEditMode">
                    <mat-icon class="pointer" (click)="menuItem.isEditMode = true">edit</mat-icon>
                    <mat-icon class="move">drag_indicator</mat-icon>
                </div>
                <div></div>
            </div>
            }
        </div>
    `,
    selector: 'app-menu-item-group',
    standalone: true,
    styleUrl: './menu-item-group.component.scss',
    imports: [MatIconModule, CommonModule, ReactiveFormsModule, FormsModule, DragDropModule]
})

export class MenuItemGroupComponent {
    @Input() allergens: any[] = [];
    @Input() menuItemGroup: MenuItemGroup | undefined;
    @Input() checkForErrors: Function = () => { return false };
    @Input() groupUuids: string[] = [];
    @Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    containsAllergen(menuItem: MenuItem, allergen: Allergen) {
        const contains = menuItem.allergens.find((a) => a.id === allergen.id);
        return contains;
    }

    toggleAllergen(menuItem: MenuItem, allergen: Allergen) {
        menuItem.allergens.includes(allergen) ? menuItem.allergens.splice(menuItem.allergens.indexOf(allergen), 1) : menuItem.allergens.push(allergen);
        this.setDataChanged(true);
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

    setPositions(menuItem: MenuItem[]) {
        menuItem.forEach((item, index) => {
            item.position = index;
        });
    }

    drop(event: CdkDragDrop<MenuItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            this.setPositions(event.container.data);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
            this.setPositions(event.container.data);
            this.setPositions(event.previousContainer.data);
        }
        this.setDataChanged(true);
    }

    setDataChanged(event: boolean) {
        this.dataChanged.emit(event);
    }
}