import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  template: `
    <div class="container">
      This will be the homepage or landing page for new visitors.
      
    </div>
  `,
  selector: 'app-homepage',
  standalone: true,
  styleUrl: './homepage.component.scss',
  imports: [CommonModule]
})
export class HomepageComponent {
  constructor() { }

}
