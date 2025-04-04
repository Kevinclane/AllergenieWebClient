import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ApiService } from "../../../services/api.service";
import { Allergen } from "../../../models/allergen.model";
import { MenuItemResponse } from "../../../models/responses/menu-item-response.model";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Utils } from "../../../services/utils";
import { MenuItemGroupComponent } from "../../common/menu-item-group.component";
import { MenuItemGroup } from "../../../models/menu-item-group.model";
import Swal from "sweetalert2";
import {
    CdkDragDrop,
    moveItemInArray,
    DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
    template: `
        <div class="container">
            <div class="side-bar">
                <div 
                cdkDropList
                (cdkDropListDropped)="drop($event)"
                class="group-list"
                >
                @for (group of groups; track group) {
                    <div class="group-card" cdkDrag>
                        <div class="group-info">
                            <div>
                                <h3>{{group.name}}</h3>
                            </div>
                            <div class="drag-icon">
                                <mat-icon>drag_indicator</mat-icon>
                            </div>
                        </div>
                        <button (click)="addBlankMenuItem(group)">Add Menu Item</button>
                    </div>
                }
                </div>
                <button (click)="addBlankGroup()">Add Group</button>
            </div>
            <div class="main-content">
                <app-menu-item-group 
                *ngFor="let group of groups" 
                [menuItemGroup]="group" 
                [allergens]="allergens"
                [checkForErrors]="checkForErrors"
                [groupUuids]="groupUuids"
                (dataChanged)="setDataChanged($event)"></app-menu-item-group>
            </div>
        </div>
        <div class="footer">
            <button class="submit-button" (click)="submit()" [disabled]="!dataChanged">Save Changes</button>
        </div>
    `,
    selector: 'app-owner-menu',
    standalone: true,
    styleUrl: './owner-menu.component.scss',
    imports: [MatIconModule, CommonModule, FormsModule, MenuItemGroupComponent, DragDropModule]
})

export class OwnerMenuComponent implements OnInit {
    allergens: Allergen[] = [];
    groups: MenuItemGroup[] = [];
    groupUuids: string[] = [];
    dataChanged: boolean = false;

    constructor(
        private _apiService: ApiService,
        private _route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        const menuId: string = this._route.snapshot.paramMap.get('id')!;
        this._apiService.get('/menuItem/details/' + menuId).subscribe((data: MenuItemResponse) => {
            this.groups = data.groupedItems;
            this.allergens = data.allergens;
            this.groups.forEach((group) => {
                group.uuid = Utils.uuid();
                this.groupUuids.push(group.uuid);
                group.menuItems.forEach((item) => {
                    item.allergens = item.allergens ? item.allergens : [];
                    item.uuid = Utils.uuid();
                })
            });
        });
    }

    checkForErrors(field: string, min: number, max: number) {
        return field.length < min || field.length > max;
    }

    addBlankMenuItem(group: MenuItemGroup) {
        const uuid: string = Utils.uuid();
        group.menuItems.push({
            id: 0,
            menuId: parseInt(this._route.snapshot.paramMap.get('id')!),
            name: '',
            description: '',
            extraDetails: '',
            price: '',
            position: group.menuItems.length,
            menuItemGroupId: group.id,
            allergens: [],
            isEditMode: true,
            uuid: uuid,
            nameError: '',
            descriptionError: ''
        });
        setTimeout(() => {
            const element = document.getElementById(uuid);
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - (5 * parseInt(window.getComputedStyle(window.document.body).fontSize)),
                    behavior: 'smooth'
                });
            }
        }, 100);
        this.setDataChanged(true);
    }

    addBlankGroup() {
        this.groups.push({
            id: 0,
            menuId: parseInt(this._route.snapshot.paramMap.get('id')!),
            name: '',
            position: this.groups.length,
            menuItems: [],
            uuid: Utils.uuid(),
            isEditMode: true,
            groupNameError: ''
        });
        this.setDataChanged(true);
    }

    submit() {
        let canSubmit = true;
        for (const group of this.groups) {
            group.groupNameError = this.checkForErrors(group.name, 1, 50) ? 'Name must be between 1 and 50 characters' : '';
            if (group.groupNameError !== '') {
                canSubmit = false;
            }
            for (const menuItem of group.menuItems) {
                menuItem.nameError = this.checkForErrors(menuItem.name, 1, 50) ? 'Name must be between 1 and 50 characters' : '';
                menuItem.descriptionError = this.checkForErrors(menuItem.description, 1, 500) ? 'Description must be between 1 and 500 characters' : '';
                if (menuItem.nameError !== '' || menuItem.descriptionError !== '') {
                    canSubmit = false;
                }
            }
        }

        if (!canSubmit) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fix the errors in the form'
            })
            return;
        }

        this._apiService.post('/menu/updateFullMenu', this.groups).subscribe((data) => {
            this.groups = data as MenuItemGroup[];
            this.setDataChanged(false);
        });
    }

    setPositions(group: MenuItemGroup[]) {
        group.forEach((item, index) => {
            item.position = index;
        });
    }

    drop(event: CdkDragDrop<MenuItemGroup[]>) {
        moveItemInArray(this.groups, event.previousIndex, event.currentIndex);
        this.setDataChanged(true);
    }

    setDataChanged(event: boolean) {
        this.dataChanged = event;
    }
}