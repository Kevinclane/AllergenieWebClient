import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";


@Component({
    template: `
        <div class="container" (click)="route(id)">
            <div class="title">
                {{title}}
            </div>
            <div *ngFor="let detail of details" class="details">
                {{detail}}
            </div>
        </div>
    `,
    selector: 'app-common-card',
    standalone: true,
    styleUrl: './common-card.component.scss',
    imports: [CommonModule]
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