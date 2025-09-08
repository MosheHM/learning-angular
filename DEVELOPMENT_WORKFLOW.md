# Angular v20 Development Workflow Guide

## Development Environment Setup

### 1. IDE Configuration (VS Code Recommended)

#### Essential Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### VS Code Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.html": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  }
}
```

#### Workspace Snippets
```json
// .vscode/snippets.json
{
  "Angular Component": {
    "prefix": "ng-component",
    "body": [
      "import { Component } from '@angular/core';",
      "import { CommonModule } from '@angular/common';",
      "",
      "@Component({",
      "  selector: 'app-${1:component-name}',",
      "  imports: [CommonModule],",
      "  template: `",
      "    <div class=\"${1:component-name}\">",
      "      ${2:<!-- content -->}",
      "    </div>",
      "  `,",
      "  styleUrls: ['./${1:component-name}.component.scss']",
      "})",
      "export class ${3:ComponentName}Component {",
      "  $4",
      "}"
    ]
  },
  "Angular Service": {
    "prefix": "ng-service",
    "body": [
      "import { Injectable } from '@angular/core';",
      "",
      "@Injectable({",
      "  providedIn: 'root'",
      "})",
      "export class ${1:ServiceName}Service {",
      "  constructor() { }",
      "  $2",
      "}"
    ]
  }
}
```

### 2. Project Configuration

#### Angular Configuration
```json
// angular.json (key sections)
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.scss"
            ],
            "stylePreprocessorOptions": {
              "includePaths": ["src/styles"]
            }
          }
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "buildTarget": "app:build",
            "port": 4200,
            "host": "localhost",
            "open": true
          }
        }
      }
    }
  }
}
```

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"],
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/app/components/*"],
      "@services/*": ["src/app/services/*"],
      "@models/*": ["src/app/models/*"],
      "@utils/*": ["src/app/utils/*"]
    }
  }
}
```

#### Package.json Scripts
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "start:prod": "ng serve --configuration production",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "build:analyze": "ng build --configuration production --stats-json && npx webpack-bundle-analyzer dist/app/stats.json",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --browsers=ChromeHeadless --watch=false --code-coverage",
    "test:watch": "ng test --watch",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
    "e2e": "ng e2e",
    "prepare": "husky install"
  }
}
```

## Git Workflow and Hooks

### 1. Git Configuration
```bash
# .gitignore additions
# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Angular
/dist/
/tmp/
/out-tsc/
/.angular/

# Dependencies
/node_modules/
npm-debug.log*
yarn-error.log

# Environment
.env
.env.local
.env.*.local

# Testing
/coverage/
*.lcov

# Misc
*.log
*.tgz
*.tar.gz
.cache/
```

### 2. Husky Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format:check"
npx husky add .husky/pre-push "npm run test:ci"
```

### 3. Conventional Commits
```bash
# Install commitizen
npm install --save-dev @commitlint/cli @commitlint/config-conventional
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Add commit message hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## Development Workflow

### 1. Feature Development Process

#### Step 1: Create Feature Branch
```bash
git checkout -b feature/user-management
```

#### Step 2: Generate Components and Services
```bash
# Generate feature structure
ng generate component features/user-management/user-list
ng generate component features/user-management/user-detail
ng generate service features/user-management/services/user
ng generate interface features/user-management/models/user

# Generate shared components
ng generate component shared/components/loading-spinner
ng generate component shared/components/error-message
```

#### Step 3: Development Loop
```bash
# Start development server
npm start

# Run tests in watch mode (separate terminal)
npm run test:watch

# Run linting (separate terminal)
npm run lint
```

### 2. Code Organization Patterns

#### Feature Module Structure
```
src/app/features/user-management/
├── components/
│   ├── user-list/
│   │   ├── user-list.component.ts
│   │   ├── user-list.component.html
│   │   ├── user-list.component.scss
│   │   └── user-list.component.spec.ts
│   └── user-detail/
├── services/
│   ├── user.service.ts
│   └── user.service.spec.ts
├── models/
│   └── user.interface.ts
├── guards/
│   └── user-guard.ts
└── user-management.routes.ts
```

#### Shared Module Structure
```
src/app/shared/
├── components/
│   ├── loading-spinner/
│   ├── error-message/
│   └── confirmation-dialog/
├── directives/
│   ├── highlight.directive.ts
│   └── auto-focus.directive.ts
├── pipes/
│   ├── safe-html.pipe.ts
│   └── truncate.pipe.ts
├── services/
│   ├── notification.service.ts
│   └── utility.service.ts
└── models/
    ├── api-response.interface.ts
    └── common.types.ts
```

### 3. Component Development Workflow

#### Component Creation Template
```typescript
// 1. Define interface first
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// 2. Create component with signals
@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  template: `
    <div class="user-card">
      <img [src]="user().avatar" [alt]="user().name">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <button (click)="onUserClick()">View Details</button>
    </div>
  `,
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() set userData(value: User) {
    this.user.set(value);
  }
  
  @Output() userSelected = new EventEmitter<User>();
  
  private user = signal<User | null>(null);
  
  onUserClick() {
    const currentUser = this.user();
    if (currentUser) {
      this.userSelected.emit(currentUser);
    }
  }
}
```

#### Testing Strategy
```typescript
// 3. Create comprehensive tests
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display user information', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    component.userData = mockUser;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('John Doe');
    expect(compiled.querySelector('p').textContent).toContain('john@example.com');
  });

  it('should emit user when clicked', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    spyOn(component.userSelected, 'emit');
    component.userData = mockUser;
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.userSelected.emit).toHaveBeenCalledWith(mockUser);
  });
});
```

### 4. Service Development Workflow

#### Service Creation Pattern
```typescript
// 1. Define interfaces
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 2. Create service with error handling
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/users';
  
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

## Testing Workflow

### 1. Unit Testing Strategy

#### Test Configuration
```typescript
// karma.conf.js customization
module.exports = function (config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

#### Testing Utilities
```typescript
// src/testing/test-utils.ts
export class TestUtils {
  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      ...overrides
    };
  }

  static triggerEvent(element: HTMLElement, eventType: string) {
    const event = new Event(eventType);
    element.dispatchEvent(event);
  }

  static getByTestId(fixture: ComponentFixture<any>, testId: string): HTMLElement {
    return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  }
}
```

### 2. E2E Testing Setup

#### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Build and Deployment Workflow

### 1. Build Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build:analyze

# Check for duplicates
npx webpack-bundle-analyzer dist/app/stats.json
```

#### Performance Budgets
```json
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "4kb",
      "maximumError": "8kb"
    }
  ]
}
```

### 2. CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Build application
      run: npm run build:prod
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build:prod
    
    - name: Deploy to hosting
      # Add your deployment steps here
      run: echo "Deploy to your hosting service"
```

## Daily Development Checklist

### Morning Setup
- [ ] Pull latest changes: `git pull origin main`
- [ ] Install new dependencies: `npm install`
- [ ] Start development server: `npm start`
- [ ] Run tests in watch mode: `npm run test:watch`

### During Development
- [ ] Write tests before implementing features
- [ ] Run linting: `npm run lint`
- [ ] Check formatting: `npm run format:check`
- [ ] Commit frequently with conventional commits
- [ ] Keep components small and focused

### Before Committing
- [ ] Run full test suite: `npm run test:ci`
- [ ] Build production version: `npm run build:prod`
- [ ] Check bundle size: `npm run build:analyze`
- [ ] Review changes: `git diff`
- [ ] Update documentation if needed

### End of Day
- [ ] Push commits: `git push origin feature-branch`
- [ ] Update task status
- [ ] Plan next day's work

This workflow ensures consistent, high-quality Angular v20 development with modern best practices and tooling.