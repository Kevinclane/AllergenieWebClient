import { Component } from "@angular/core";

@Component({
    template: `
        <div class="header">
            <div>
                home logo
            </div>
            <div>
                center header message
            </div>
            <div>
                profile icon
            </div>
        </div>
    `,
    selector: 'app-header',
    standalone: true,
    styleUrl: './header.component.scss'
})

export class HeaderComponent {
    constructor() { }
}