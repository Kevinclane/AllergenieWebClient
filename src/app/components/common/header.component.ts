import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { HeaderStateService } from "../../services/states/header-state.service";

@Component({
    template: `
        <div class="header">
            <mat-icon>home</mat-icon>
            <div>
                {{title}}
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
    title: string = '';

    constructor(_headerStateService: HeaderStateService) {
        _headerStateService.getTitle().subscribe(t => {
            this.title = t;
        })
    }
}