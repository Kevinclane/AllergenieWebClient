import { Component, Input } from "@angular/core";
import { Menu } from "../../../../../models/menu.model";


@Component({
    template: `
        {{menu.name}}
    `,
    selector: 'app-owner-menu-module',
    standalone: true,
    // styleUrl: './owner-menu-module.component.scss',

})

export class OwnerMenuModuleComponent {
    @Input() menu: Menu;
    constructor() {
        this.menu = {
            id: 0,
            name: '',
            isActive: false
        };
    }
}
