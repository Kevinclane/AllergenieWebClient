import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    template: `
        <div class="header">
            <mat-icon>home</mat-icon>
            <div>
                center header message
            </div>
            <mat-icon>account_circle</mat-icon>
        </div>
    `,
    selector: 'app-header',
    standalone: true,
    styleUrl: './header.component.scss',
    imports: [MatIconModule]
})

export class HeaderComponent {
    constructor() { }
}