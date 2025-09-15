import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-side-bar-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './side-bar-menu.html',
  styleUrl: './side-bar-menu.scss'
})
export class SideBarMenu {

  menuItems: MenuItem[] = [
    { id: 'orders', label: 'Orders' },
    { id: 'shipments', label: 'Shipments' },
    { id: 'documents', label: 'Documents' },
    { id: 'appeals', label: 'Appeals' }
  ];

  constructor() {}
}
