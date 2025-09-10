import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Page } from '../component/page/page';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Page],
  template: `
      <router-outlet>
        <div class="app-shell">
          <app-header></app-header>
          <div class="shell-content">
            <div class="page-container">
              <app-page></app-page>
            </div>
          </div>
        </div>
      </router-outlet>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  // Shell component logic here
}