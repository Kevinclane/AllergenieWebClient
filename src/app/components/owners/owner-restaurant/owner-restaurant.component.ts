import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Menu } from "../../../models/menu.model";
import { CommonModule } from "@angular/common";
import { CommonCardComponent } from "../../common/common-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewMenuDialogComponent } from "../../dialogs/new-menu-dialog.component";
import { EditMenuDialogComponent } from "../../dialogs/edit-menu-dialog.component";
import Swal from "sweetalert2";
import { HeaderStateService } from "../../../services/states/header-state.service";


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
                [details]="[menu.isActive ? 'Active' : 'Inactive']"
                [routeURI]="'/owners/menu'"
                [id]="menu.id"
                (editItem)="openEditMenuDialog($event)"
                (deleteItem)="deleteMenu($event)"
                />
            </div>
        </div>
    `,
    selector: 'app-owner-restaurant',
    standalone: true,
    styleUrls: ['./owner-restaurant.component.scss', '../../common/scss-files/common-dashboard.component.scss'],
    imports: [CommonModule, CommonCardComponent, MatIconModule],
})

export class OwnerRestaurantComponent implements OnInit {
    menus: Menu[] = [];

    constructor(
        private _apiService: ApiService,
        private _route: ActivatedRoute,
        private _headerStateService: HeaderStateService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        const title = this._route.snapshot.paramMap.get('name') || '' ;
        this._headerStateService.setTitle(title);
        this.getAllMenus();
    }

    getAllMenus() {
        this._apiService.get('/menu/all/' + this._route.snapshot.paramMap.get('id')).subscribe((data: any) => {
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
                restaurantId: this._route.snapshot.paramMap.get('id'),
                activeMenuId: 0
            }
        }).afterClosed().subscribe((data: any) => {
            if (data) {
                this.getAllMenus();
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
                restaurantId: this._route.snapshot.paramMap.get('id'),
                activeMenuId: menuId
            }
        }).afterClosed().subscribe((data: any) => {
            if (data) {
                this.getAllMenus();
            }
        });
    }

    deleteMenu(id: number) {
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
                this._apiService.delete(`/menu/${id}`).subscribe((data) => {
                    this.menus = this.menus.filter((menu: Menu) => menu.id !== id);
                    Swal.fire(
                        'Deleted!',
                        'success'
                    );
                });
            }
        })
    }

}