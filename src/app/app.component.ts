import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  template: `
    <router-outlet />
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AllergenieWebClient';
}
