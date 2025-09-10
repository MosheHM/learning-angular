import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Page } from '../component/page/page';
import { SideBarMenu } from '../side-bar-menu/side-bar-menu';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Page, SideBarMenu],
  template: `
      <router-outlet>
        <div class="app-shell">
          <app-side-bar-menu></app-side-bar-menu>
          <div class="main-content">
            <app-header></app-header>
            <div class="shell-content">
              <div class="page-container">
                <app-page></app-page>
              </div>
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