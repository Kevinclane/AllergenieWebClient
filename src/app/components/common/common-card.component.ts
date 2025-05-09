import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';


@Component({
    template: `
        <div class="container">
            <div class="header">
                <div class="buttons">
                    <mat-icon class="edit" (click)="edit(id)">edit</mat-icon>
                    <mat-icon class="delete" (click)="delete(id)">delete</mat-icon>
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
    @Output() editItem: EventEmitter<number> = new EventEmitter<number>();
    @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _router: Router
    ) { }

    route(id: number) {
        this._router.navigate([this.routeURI, id, this.title]);
    }

    edit(item: number) {
        this.editItem.emit(item);
    }

    delete(item: number) {
        this.deleteItem.emit(item);
    }
}