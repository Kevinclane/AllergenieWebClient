import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Menu } from "../../../../models/menu.model";
import { CommonModule } from "@angular/common";
import { CommonCardComponent } from "../../../common/common-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewMenuDialogComponent } from "../../../dialogs/new-menu-dialog.component";
import { EditMenuDialogComponent } from "../../../dialogs/edit-menu-dialog.component";


@Component({
    template: `
        <div class="container">
            <div class="row">
                <button class="button-primary" (click)="openNewMenuDialog()">Add Menu</button>
            </div>
            <div class="grid">
                <app-common-card 
                *ngFor="let menu of menus" 
                [title]="menu.name"
                [id]="menu.id"
                [details]="[menu.isActive ? 'Active' : 'Inactive']"
                (editItem)="openEditMenuDialog($event)"
                />
            </div>
        </div>
    `,
    selector: 'app-owner-restaurant',
    standalone: true,
    styleUrls: ['./owner-restaurant.component.scss', '../../../common/scss-files/common-dashboard.component.scss'],
    imports: [CommonModule, CommonCardComponent, MatIconModule],
})

export class OwnerRestaurantComponent implements OnInit {
    menus: Menu[] = [];

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.getAllMenus();
    }

    getAllMenus() {
        this.apiService.get('/menu/all/' + this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
            this.menus = data;
        });
    }

    openNewMenuDialog() {
        this.dialog.open(NewMenuDialogComponent, {
            minHeight: '350px',
            minWidth: '300px',
            height: 'auto',
            width: 'auto',
            data: {
                menus: this.menus,
                restaurantId: this.route.snapshot.paramMap.get('id'),
                activeMenuId: 0
            }
        }).afterClosed().subscribe((data: any) => {
            if (data) {
                this.menus.push(data);
            }
        });
    }

    openEditMenuDialog(menuId: number) {
        this.dialog.open(EditMenuDialogComponent, {
            minHeight: '350px',
            minWidth: '300px',
            height: 'auto',
            width: 'auto',
            data: {
                menus: this.menus,
                restaurantId: this.route.snapshot.paramMap.get('id'),
                activeMenuId: menuId
            }
        }).afterClosed().subscribe((data: any) => {
            if (data) {
                this.getAllMenus();
            }
        });
    }


}