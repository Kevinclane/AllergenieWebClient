import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';


@Component({
    template: `
        <div class="container">
            <div class="header">
                <div class="buttons">
                    <mat-icon class="edit">edit</mat-icon>
                    <mat-icon class="delete">delete</mat-icon>
                </div>
            </div>
            <div class="main-content" (click)="route(id)" >
                <div class="title">
                    {{title}}
                </div>
                <div *ngFor="let detail of details" class="details">
                    {{detail}}
                </div>
            </div>
        </div>
    `,
    selector: 'app-common-card',
    standalone: true,
    styleUrl: './common-card.component.scss',
    imports: [CommonModule, MatIconModule],
})

export class CommonCardComponent {
    @Input() title: string = '';
    @Input() details: string[] = [];
    @Input() routeURI: string = '';
    @Input() id: number = 0;

    constructor(
        private router: Router
    ) { }

    route(id: number) {
        this.router.navigate([this.routeURI, id]);
    }
}