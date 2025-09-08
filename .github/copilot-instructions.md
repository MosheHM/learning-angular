# Angular Learning Project - AI Coding Instructions

## Architecture Overview

This is a **modern Angular 20.2.0** learning project using **standalone components** (no NgModules). The application follows a hierarchical component structure:

```
App (root)
├── Header (navigation)
└── Body (main content)
    ├── Left (sidebar)
    └── Right (main area)
```

## Key Patterns & Conventions

### Component Structure
- **Standalone Components**: All components use `imports: []` array instead of NgModules
- **Signals**: Use Angular signals for reactive state (e.g., `signal('value')`)
- **File Organization**: Each component has its own folder with `.ts`, `.html`, `.scss` files
- **Naming Convention**: Component files follow `component-name.ts/html/scss` pattern
- **Selectors**: Use `app-` prefix for all component selectors

### Component Example Pattern
```typescript
@Component({
  selector: 'app-component-name',
  imports: [ChildComponent1, ChildComponent2],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss'
})
export class ComponentName {
  // Use signals for reactive state
  protected readonly someState = signal('initial-value');
}
```

### Styling & Markup
- **SCSS**: All styles use SCSS (not CSS)
- **Class Naming**: Follow BEM-like convention (e.g., `app-header`, `header-content`)
- **Responsive Design**: Components designed for flexible layouts

## Development Workflow

### Essential Commands
```bash
npm start        # Start dev server (ng serve)
npm run build    # Production build
npm run watch    # Development build with watch mode  
npm test         # Run Karma/Jasmine tests
```

### Build Configuration
- **Builder**: Uses modern `@angular/build:application` (esbuild-based)
- **Output**: Built to `dist/learning-angular/`
- **SCSS**: Configured as `inlineStyleLanguage`
- **TypeScript**: Strict mode enabled with comprehensive type checking

### Testing Setup
- **Framework**: Karma + Jasmine
- **Current Issue**: Test expects "Hello, learning-angular" but component shows "Learning Angular"
- **Run Headless**: Use `--browsers=ChromeHeadless --watch=false` for CI

## TypeScript Configuration

### Compiler Settings
- **Strict Mode**: Full strict mode enabled
- **Target**: ES2022 with `module: "preserve"`
- **Angular Compiler**: Strict templates and injection parameters
- **Experimental Decorators**: Enabled for Angular

### Code Style
- **Prettier**: Configured in package.json with Angular HTML parser
- **EditorConfig**: 2-space indentation, single quotes for TypeScript
- **No Linting**: No ESLint/TSLint - relies on TypeScript compiler strict mode

## Project-Specific Guidelines

### Component Creation
1. Create folder under appropriate parent (e.g., `src/app/component-name/`)
2. Include `.ts`, `.html`, `.scss` files
3. Use standalone component pattern
4. Import in parent component's `imports` array
5. Add to parent template with selector

### State Management
- **Signals**: Primary reactive primitive for component state
- **No Complex State**: Currently no services or complex state management
- **Component Communication**: Parent-child via inputs/outputs

### Routing
- **Current State**: Empty routes array in `app.routes.ts`
- **Router Outlet**: Available but unused (`<router-outlet />` in app.html)

## Common Tasks

### Adding a New Component
```bash
# Manual creation (no ng generate available in build env)
mkdir src/app/new-component
# Create .ts, .html, .scss files following existing patterns
```

### Fixing the Test
The failing test expects "Hello, learning-angular" but header shows "Learning Angular". Update either:
- Test expectation in `app.spec.ts:21`
- Header content in `header/header.html:3`

### Building for Production
- Uses Angular's optimized build with budgets (500kB initial warning, 1MB error)
- Output hashing enabled for cache busting
- SCSS compiled to CSS automatically