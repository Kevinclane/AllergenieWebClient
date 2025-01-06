import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Menu } from "../../../../models/menu.model";
import { CommonModule } from "@angular/common";
import { CommonCardComponent } from "../../../common/common-card.component";


@Component({
    template: `
        <div class="container">
            <div class="row">
                <app-common-card 
                *ngFor="let menu of menus" 
                [title]="menu.name"
                [details]="[menu.isActive ? 'Active' : 'Inactive']"
                />
            </div>
        </div>
    `,
    selector: 'app-owner-restaurant',
    standalone: true,
    styleUrl: './owner-restaurant.component.scss',
    imports: [CommonModule, CommonCardComponent],
})

export class OwnerRestaurantComponent implements OnInit {
    menus: Menu[] = [];

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.apiService.get('/menu/all/' + this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
            this.menus = data;
        });
    }

}