# Complete Angular v20 Agent Instructions

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup and Installation](#setup-and-installation)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [New Features in Angular v20](#new-features-in-angular-v20)
7. [Component Development](#component-development)
8. [Service Development](#service-development)
9. [Routing and Navigation](#routing-and-navigation)
10. [Testing Strategies](#testing-strategies)
11. [Build and Deployment](#build-and-deployment)
12. [Best Practices](#best-practices)
13. [Performance Optimization](#performance-optimization)
14. [Troubleshooting](#troubleshooting)
15. [Migration Guide](#migration-guide)

## Overview

Angular v20 represents a significant evolution in the Angular framework, introducing enhanced performance, improved developer experience, and modern development patterns. This guide provides comprehensive instructions for developing with Angular v20.

### Key Highlights of Angular v20
- **Standalone Components by Default**: No more NgModules required for basic apps
- **New Application Builder**: Enhanced build system with better performance
- **Improved Signals**: Enhanced reactivity system
- **Modern Project Structure**: Streamlined file organization
- **Enhanced Testing**: Better testing utilities and performance

## Prerequisites

### System Requirements
- **Node.js**: v18.19.0 or later (v20.x recommended)
- **npm**: v9.x or later
- **TypeScript**: v5.9.0 or later
- **Modern Browser**: Chrome 119+, Firefox 120+, Safari 16.4+, Edge 119+

### Development Tools (Recommended)
- **VS Code** with Angular Language Service extension
- **Angular DevTools** browser extension
- **Git** for version control

## Setup and Installation

### 1. Install Angular CLI
```bash
# Install globally
npm install -g @angular/cli@latest

# Verify installation
ng version
```

### 2. Create New Project
```bash
# Create new Angular v20 project
ng new my-angular-app

# Navigate to project
cd my-angular-app

# Start development server
ng serve
```

### 3. Project Configuration Options
During project creation, you'll be prompted for:
- **Routing**: Enable Angular Router (recommended: Yes)
- **Stylesheet format**: CSS, SCSS, Sass, Less (recommended: SCSS)
- **SSR**: Server-Side Rendering (optional)

## Project Structure

Angular v20 projects follow this structure:

```
learning-angular/
├── public/                 # Static assets
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── app/               # Application code
│   │   ├── components/    # Reusable components
│   │   ├── services/      # Business logic services
│   │   ├── models/        # TypeScript interfaces/types
│   │   ├── guards/        # Route guards
│   │   ├── pipes/         # Custom pipes
│   │   ├── app.ts         # Root component
│   │   ├── app.html       # Root template
│   │   ├── app.scss       # Root styles
│   │   ├── app.config.ts  # App configuration
│   │   └── app.routes.ts  # Route definitions
│   ├── styles.scss        # Global styles
│   ├── main.ts           # Application bootstrap
│   └── index.html        # Main HTML file
├── angular.json          # Angular CLI configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

### Key Configuration Files

#### `app.config.ts` - Application Configuration
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Add other providers here
  ]
};
```

#### `main.ts` - Bootstrap Application
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

## Development Workflow

### 1. Development Server
```bash
# Start development server
ng serve

# With specific port
ng serve --port 4201

# With host binding
ng serve --host 0.0.0.0

# Open browser automatically
ng serve --open
```

### 2. Code Generation
```bash
# Generate component
ng generate component my-component

# Generate service
ng generate service my-service

# Generate interface
ng generate interface my-interface

# Generate pipe
ng generate pipe my-pipe

# Generate guard
ng generate guard my-guard
```

### 3. Building the Application
```bash
# Development build
ng build

# Production build
ng build --configuration production

# Watch mode
ng build --watch
```

### 4. Testing
```bash
# Run unit tests
ng test

# Run tests once
ng test --watch=false

# Run tests with coverage
ng test --code-coverage

# Run e2e tests (if configured)
ng e2e
```

## New Features in Angular v20

### 1. Standalone Components (Default)
Components no longer require NgModules:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  imports: [CommonModule], // Direct imports
  template: `<p>Standalone component!</p>`,
  styleUrls: ['./my-component.scss']
})
export class MyComponent { }
```

### 2. Enhanced Signals
Improved reactivity system:

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  `
})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment() {
    this.count.update(value => value + 1);
  }
}
```

### 3. New Application Builder
Enhanced build performance with esbuild:

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application"
        }
      }
    }
  }
}
```

### 4. Control Flow Syntax
New template syntax for conditional rendering:

```html
<!-- New @if syntax -->
@if (condition) {
  <p>Condition is true</p>
} @else {
  <p>Condition is false</p>
}

<!-- New @for syntax -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items</p>
}

<!-- New @switch syntax -->
@switch (status) {
  @case ('loading') {
    <p>Loading...</p>
  }
  @case ('error') {
    <p>Error occurred</p>
  }
  @default {
    <p>Content</p>
  }
}
```

## Component Development

### 1. Creating Components
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onSelect()">Select</button>
    </div>
  `,
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string; id: number };
  @Output() userSelected = new EventEmitter<number>();

  onSelect() {
    this.userSelected.emit(this.user.id);
  }
}
```

### 2. Component Lifecycle
```typescript
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  template: `<p>Lifecycle component</p>`
})
export class LifecycleComponent implements OnInit, OnDestroy, AfterViewInit {
  
  ngOnInit() {
    console.log('Component initialized');
  }

  ngAfterViewInit() {
    console.log('View initialized');
  }

  ngOnDestroy() {
    console.log('Component destroyed');
  }
}
```

### 3. Signal-based Components
```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-todo',
  template: `
    <div>
      <input #input (keyup.enter)="addTodo(input.value); input.value = ''">
      <ul>
        @for (todo of todos(); track todo.id) {
          <li [class.completed]="todo.completed">
            {{ todo.text }}
            <button (click)="toggleTodo(todo.id)">Toggle</button>
          </li>
        }
      </ul>
      <p>Total: {{ totalCount() }}, Completed: {{ completedCount() }}</p>
    </div>
  `
})
export class TodoComponent {
  todos = signal<Array<{id: number, text: string, completed: boolean}>>([]);
  
  totalCount = computed(() => this.todos().length);
  completedCount = computed(() => this.todos().filter(t => t.completed).length);

  addTodo(text: string) {
    if (text.trim()) {
      this.todos.update(todos => [...todos, {
        id: Date.now(),
        text: text.trim(),
        completed: false
      }]);
    }
  }

  toggleTodo(id: number) {
    this.todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
}
```

## Service Development

### 1. Creating Services
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Service error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### 2. Signal-based Services
```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);
  
  // Computed values
  readonly totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalPrice = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  // Read-only access to items
  readonly cartItems = this.items.asReadonly();

  addItem(product: Omit<CartItem, 'quantity'>) {
    this.items.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeItem(id: number) {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    
    this.items.update(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
```

## Routing and Navigation

### 1. Route Configuration
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UserListComponent } from './users/user-list.component';
import { UserDetailComponent } from './users/user-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' } // Wildcard route
];
```

### 2. Navigation
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
      <a routerLink="/users">Users</a>
      <button (click)="goToUser(1)">Go to User 1</button>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class NavComponent {
  constructor(private router: Router) {}

  goToUser(id: number) {
    this.router.navigate(['/users', id]);
  }
}
```

### 3. Route Guards
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
```

## Testing Strategies

### 1. Unit Testing Components
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('John Doe');
  });

  it('should emit user selected event', () => {
    spyOn(component.userSelected, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    
    button?.click();
    
    expect(component.userSelected.emit).toHaveBeenCalledWith(1);
  });
});
```

### 2. Testing Services
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### 3. Testing Signals
```typescript
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should add item to cart', () => {
    const product = { id: 1, name: 'Product 1', price: 10 };
    
    service.addItem(product);
    
    expect(service.cartItems()).toHaveLength(1);
    expect(service.totalItems()).toBe(1);
    expect(service.totalPrice()).toBe(10);
  });

  it('should update quantity for existing item', () => {
    const product = { id: 1, name: 'Product 1', price: 10 };
    
    service.addItem(product);
    service.addItem(product);
    
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBe(20);
  });
});
```

## Build and Deployment

### 1. Build Configurations
```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          }
        }
      }
    }
  }
}
```

### 2. Building for Production
```bash
# Production build
ng build --configuration production

# Analyze bundle size
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/my-app/stats.json
```

### 3. Deployment Examples

#### Static Hosting (Netlify, Vercel)
```bash
# Build for production
ng build --configuration production

# Deploy dist folder to your hosting service
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/my-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build -- --base-href=/repository-name/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/my-app
```

## Best Practices

### 1. Code Organization
- Use feature modules to organize related functionality
- Follow consistent naming conventions
- Keep components small and focused
- Use services for business logic

### 2. Performance Best Practices
```typescript
// Use OnPush change detection
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class OptimizedComponent {}

// Use trackBy for lists
@Component({
  template: `
    @for (item of items; track trackByFn) {
      <div>{{ item.name }}</div>
    }
  `
})
export class ListComponent {
  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// Lazy load modules
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.routes').then(m => m.routes)
  }
];
```

### 3. Security Best Practices
```typescript
// Sanitize user input
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  template: `<div [innerHTML]="sanitizedContent"></div>`
})
export class SafeComponent {
  constructor(private sanitizer: DomSanitizer) {}
  
  get sanitizedContent() {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.userContent);
  }
}

// Use HTTPS interceptor
@Injectable()
export class HttpsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const httpsReq = req.clone({
      url: req.url.replace('http://', 'https://')
    });
    return next.handle(httpsReq);
  }
}
```

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/my-app/stats.json
```

### 2. Lazy Loading
```typescript
// Lazy load feature modules
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes)
  }
];
```

### 3. Preloading Strategies
```typescript
// app.config.ts
import { PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
};
```

## Troubleshooting

### Common Issues and Solutions

#### 1. HttpClient Provider Missing
**Error**: `No provider found for HttpClient`
**Solution**: Add `provideHttpClient()` to app.config.ts
```typescript
providers: [provideHttpClient()]
```

#### 2. Module Import Errors
**Error**: `Can't resolve module`
**Solution**: Check import paths and ensure module is properly exported

#### 3. Build Errors
**Error**: Build fails with TypeScript errors
**Solution**: 
- Check TypeScript version compatibility
- Update @angular/cli and @angular/core
- Clear node_modules and reinstall

#### 4. Test Configuration
**Error**: Tests fail with dependency injection errors
**Solution**: Provide necessary services in test configuration
```typescript
TestBed.configureTestingModule({
  providers: [provideHttpClient()]
});
```

### Debugging Tips
1. Use Angular DevTools browser extension
2. Enable source maps in development
3. Use console.log strategically
4. Use Angular CLI built-in debugging: `ng serve --verbose`

## Migration Guide

### From Angular 19 to 20
1. Update Angular CLI and packages:
```bash
ng update @angular/cli @angular/core
```

2. Review breaking changes in the official migration guide
3. Update imports to use new standalone component syntax
4. Test thoroughly after migration

### Best Migration Practices
- Migrate incrementally
- Test each step
- Keep backup of working version
- Update one major version at a time

---

This guide provides comprehensive instructions for developing with Angular v20. For the latest updates and detailed API documentation, refer to the [official Angular documentation](https://angular.dev).