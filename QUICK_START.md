# Angular v20 Quick Start Agent Instructions

## Immediate Setup (5 minutes)

### 1. Prerequisites Check
```bash
# Check Node.js version (should be 18.19.0+)
node --version

# Check npm version
npm --version

# Install Angular CLI if not present
npm install -g @angular/cli@latest

# Verify Angular CLI
ng version
```

### 2. Create Project
```bash
# Create new Angular v20 project
ng new my-app

# Navigate and start
cd my-app
ng serve

# Open in browser: http://localhost:4200
```

### 3. Essential Commands
```bash
# Development
ng serve                    # Start dev server
ng build                    # Build project
ng test                     # Run tests
ng generate component name  # Create component
ng generate service name    # Create service

# Production
ng build --configuration production
```

## Key Differences from Previous Versions

### 1. Standalone Components (Default)
```typescript
// OLD (Module-based)
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})

// NEW (Standalone)
@Component({
  selector: 'app-my-component',
  imports: [CommonModule],  // Direct imports
  template: `...`
})
```

### 2. New Control Flow
```html
<!-- NEW flow syntax -->
@if (condition) {
  <div>Content</div>
}
@for (item of items; track item.id) {
  <div>{{ item }}</div>
} @empty {
  <div>No items</div>
}
```

### 3. Signals (Recommended)
```typescript
// Reactive state management
import { signal, computed } from '@angular/core';

export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(value => value + 1);
  }
}
```

## Project Structure Template

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── header/
│   │   ├── footer/
│   │   └── shared/
│   ├── services/           # Business logic
│   │   ├── api.service.ts
│   │   └── auth.service.ts
│   ├── models/             # TypeScript interfaces
│   │   └── user.interface.ts
│   ├── guards/             # Route protection
│   │   └── auth.guard.ts
│   ├── pipes/              # Data transformation
│   │   └── custom.pipe.ts
│   ├── app.ts              # Root component
│   ├── app.config.ts       # App configuration
│   └── app.routes.ts       # Route definitions
├── assets/                 # Static files
├── styles.scss            # Global styles
└── main.ts               # App bootstrap
```

## Essential Patterns

### 1. Service with Signals
```typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos = signal<Todo[]>([]);
  
  readonly allTodos = this.todos.asReadonly();
  readonly completedCount = computed(() => 
    this.todos().filter(t => t.completed).length
  );

  addTodo(text: string) {
    this.todos.update(todos => [...todos, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }
}
```

### 2. Component with Service
```typescript
@Component({
  selector: 'app-todo-list',
  imports: [CommonModule],
  template: `
    @for (todo of todoService.allTodos(); track todo.id) {
      <div>{{ todo.text }}</div>
    }
    <p>Completed: {{ todoService.completedCount() }}</p>
  `
})
export class TodoListComponent {
  constructor(public todoService: TodoService) {}
}
```

### 3. HTTP Service
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users');
  }

  createUser(user: CreateUserDto) {
    return this.http.post<User>('/api/users', user);
  }
}
```

### 4. Route Configuration
```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.routes'),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
```

## Testing Setup

### 1. Component Test
```typescript
describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

### 2. Service Test
```typescript
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
});
```

## Common Commands Reference

```bash
# Project Creation
ng new app-name
ng new app-name --routing --style=scss

# Code Generation
ng g c component-name           # Component
ng g s service-name            # Service  
ng g m module-name             # Module (if needed)
ng g g guard-name              # Guard
ng g p pipe-name               # Pipe
ng g i interface-name          # Interface

# Development
ng serve                       # Start dev server
ng serve --port 4201          # Custom port
ng serve --open               # Auto-open browser

# Building
ng build                      # Development build
ng build --prod              # Production build
ng build --watch             # Watch mode

# Testing
ng test                      # Unit tests
ng test --code-coverage      # With coverage
ng test --browsers=ChromeHeadless --watch=false  # CI mode

# Linting & Formatting
ng lint                      # Lint code
npm run format               # Format code (if configured)

# Package Management
npm install package-name     # Add dependency
npm install -D package-name  # Add dev dependency
npm update                   # Update packages
```

## Deployment Quick Guide

### 1. Build for Production
```bash
ng build --configuration production
```

### 2. Static Hosting (Netlify/Vercel)
- Upload `dist/app-name` folder
- Configure redirects for SPA routing

### 3. Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/app-name /usr/share/nginx/html
```

## Troubleshooting Checklist

### Build Issues
- [ ] Check Node.js version (18.19.0+)
- [ ] Clear `node_modules` and reinstall
- [ ] Update Angular CLI: `ng update @angular/cli`
- [ ] Check TypeScript version compatibility

### Test Issues
- [ ] Ensure `provideHttpClient()` in test config
- [ ] Import required modules in test setup
- [ ] Check for async operations in tests

### Runtime Issues
- [ ] Check browser console for errors
- [ ] Verify imports in components
- [ ] Ensure services are provided correctly
- [ ] Check route configuration

## Next Steps
1. Read the complete [ANGULAR_V20_GUIDE.md](./ANGULAR_V20_GUIDE.md)
2. Explore Angular DevTools browser extension
3. Join Angular community on Discord/Reddit
4. Follow Angular blog for updates