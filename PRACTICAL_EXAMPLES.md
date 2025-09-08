# Angular v20 Practical Examples

## Real-World Component Examples

### 1. User Profile Component with Signals
```typescript
// user-profile.component.ts
import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-profile">
      <div class="avatar-section">
        <img [src]="avatarUrl()" [alt]="user().name" class="avatar">
        <span class="status-indicator" [class.online]="user().isOnline"></span>
      </div>
      
      <div class="user-info">
        <h2>{{ user().name }}</h2>
        <p class="email">{{ user().email }}</p>
        <p class="status">{{ statusText() }}</p>
        
        @if (isEditing()) {
          <div class="edit-form">
            <input [(ngModel)]="editedName" placeholder="Name">
            <input [(ngModel)]="editedEmail" placeholder="Email">
            <button (click)="saveChanges()">Save</button>
            <button (click)="cancelEdit()">Cancel</button>
          </div>
        } @else {
          <button (click)="startEdit()">Edit Profile</button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() set userData(value: User) {
    this.user.set(value);
  }

  private user = signal<User>({
    id: 0,
    name: '',
    email: '',
    isOnline: false
  });

  private isEditing = signal(false);
  
  // Computed values
  readonly avatarUrl = computed(() => {
    const user = this.user();
    return user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
  });

  readonly statusText = computed(() => {
    return this.user().isOnline ? 'Online' : 'Offline';
  });

  // Edit state
  editedName = '';
  editedEmail = '';

  startEdit() {
    const currentUser = this.user();
    this.editedName = currentUser.name;
    this.editedEmail = currentUser.email;
    this.isEditing.set(true);
  }

  saveChanges() {
    this.user.update(current => ({
      ...current,
      name: this.editedName,
      email: this.editedEmail
    }));
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}
```

### 2. Shopping Cart Service
```typescript
// cart.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);
  
  // Public readonly access
  readonly cartItems = this.items.asReadonly();
  
  // Computed values
  readonly itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalPrice = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    // Persist cart to localStorage
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });

    // Load cart from localStorage on init
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        this.items.set(items);
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }

  addItem(product: Product, quantity: number = 1) {
    this.items.update(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, { ...product, quantity }];
    });
  }

  removeItem(productId: number) {
    this.items.update(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart() {
    this.items.set([]);
  }

  getItemQuantity(productId: number): number {
    return this.items().find(item => item.id === productId)?.quantity || 0;
  }
}
```

### 3. Data Table Component
```typescript
// data-table.component.ts
import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table">
      <!-- Search/Filter -->
      <div class="table-controls">
        <input 
          type="text" 
          [(ngModel)]="searchTerm"
          placeholder="Search..."
          class="search-input"
          (input)="onSearchChange()"
        >
        <span class="results-count">
          Showing {{ filteredData().length }} of {{ data().length }} items
        </span>
      </div>

      <!-- Table -->
      <table class="table">
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th 
                [class.sortable]="column.sortable"
                (click)="column.sortable && toggleSort(column.key)"
              >
                {{ column.label }}
                @if (column.sortable && sortConfig().key === column.key) {
                  <span class="sort-indicator">
                    {{ sortConfig().direction === 'asc' ? '↑' : '↓' }}
                  </span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData(); track row.id) {
            <tr>
              @for (column of columns(); track column.key) {
                <td>{{ row[column.key] }}</td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length" class="no-data">
                No data available
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="pagination">
          <button 
            (click)="goToPage(currentPage() - 1)"
            [disabled]="currentPage() === 1"
          >
            Previous
          </button>
          
          @for (page of pageNumbers(); track page) {
            <button 
              (click)="goToPage(page)"
              [class.active]="page === currentPage()"
            >
              {{ page }}
            </button>
          }
          
          <button 
            (click)="goToPage(currentPage() + 1)"
            [disabled]="currentPage() === totalPages()"
          >
            Next
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() set tableData(value: any[]) {
    this.data.set(value || []);
  }

  @Input() set tableColumns(value: TableColumn[]) {
    this.columns.set(value || []);
  }

  @Input() pageSize = 10;

  private data = signal<any[]>([]);
  private columns = signal<TableColumn[]>([]);
  private sortConfig = signal<SortConfig>({ key: '', direction: null });
  private currentPage = signal(1);
  
  searchTerm = '';

  // Computed properties
  readonly filteredData = computed(() => {
    const data = this.data();
    const search = this.searchTerm.toLowerCase().trim();
    
    if (!search) return data;
    
    return data.filter(row =>
      this.columns().some(column =>
        String(row[column.key]).toLowerCase().includes(search)
      )
    );
  });

  readonly sortedData = computed(() => {
    const data = [...this.filteredData()];
    const sort = this.sortConfig();
    
    if (!sort.key || !sort.direction) return data;
    
    return data.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      
      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.sortedData().length / this.pageSize)
  );

  readonly paginatedData = computed(() => {
    const data = this.sortedData();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return data.slice(start, end);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    
    return pages;
  });

  toggleSort(key: string) {
    this.sortConfig.update(current => {
      if (current.key !== key) {
        return { key, direction: 'asc' };
      }
      
      const direction = current.direction === 'asc' ? 'desc' : 
                       current.direction === 'desc' ? null : 'asc';
      
      return { key: direction ? key : '', direction };
    });
  }

  goToPage(page: number) {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this.currentPage.set(page);
    }
  }

  onSearchChange() {
    this.currentPage.set(1); // Reset to first page on search
  }
}
```

### 4. Form Validation Component
```typescript
// contact-form.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
      <h2>Contact Us</h2>
      
      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Name *</label>
        <input 
          type="text" 
          id="name" 
          formControlName="name"
          [class.error]="isFieldInvalid('name')"
        >
        @if (isFieldInvalid('name')) {
          <div class="error-message">
            @if (contactForm.get('name')?.errors?.['required']) {
              Name is required
            }
            @if (contactForm.get('name')?.errors?.['minlength']) {
              Name must be at least 2 characters
            }
          </div>
        }
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          formControlName="email"
          [class.error]="isFieldInvalid('email')"
        >
        @if (isFieldInvalid('email')) {
          <div class="error-message">
            @if (contactForm.get('email')?.errors?.['required']) {
              Email is required
            }
            @if (contactForm.get('email')?.errors?.['email']) {
              Please enter a valid email
            }
          </div>
        }
      </div>

      <!-- Subject Field -->
      <div class="form-group">
        <label for="subject">Subject *</label>
        <select 
          id="subject" 
          formControlName="subject"
          [class.error]="isFieldInvalid('subject')"
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="support">Technical Support</option>
          <option value="billing">Billing Question</option>
          <option value="feedback">Feedback</option>
        </select>
        @if (isFieldInvalid('subject')) {
          <div class="error-message">Please select a subject</div>
        }
      </div>

      <!-- Message Field -->
      <div class="form-group">
        <label for="message">Message *</label>
        <textarea 
          id="message" 
          formControlName="message"
          rows="5"
          [class.error]="isFieldInvalid('message')"
        ></textarea>
        @if (isFieldInvalid('message')) {
          <div class="error-message">
            @if (contactForm.get('message')?.errors?.['required']) {
              Message is required
            }
            @if (contactForm.get('message')?.errors?.['minlength']) {
              Message must be at least 10 characters
            }
          </div>
        }
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button 
          type="submit" 
          [disabled]="!contactForm.valid || isSubmitting()"
          class="submit-btn"
        >
          @if (isSubmitting()) {
            Sending...
          } @else {
            Send Message
          }
        </button>
      </div>

      <!-- Success Message -->
      @if (submitSuccess()) {
        <div class="success-message">
          Thank you! Your message has been sent successfully.
        </div>
      }

      <!-- Error Message -->
      @if (submitError()) {
        <div class="error-message">
          Sorry, there was an error sending your message. Please try again.
        </div>
      }
    </form>
  `,
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  
  private isSubmitting = signal(false);
  private submitSuccess = signal(false);
  private submitError = signal(false);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      this.submitSuccess.set(false);
      this.submitError.set(false);

      try {
        // Simulate API call
        await this.submitForm(this.contactForm.value);
        this.submitSuccess.set(true);
        this.contactForm.reset();
      } catch (error) {
        this.submitError.set(true);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  private async submitForm(formData: ContactForm): Promise<void> {
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log('Form submitted:', formData);
          resolve();
        } else {
          reject(new Error('Simulated error'));
        }
      }, 2000);
    });
  }
}
```

### 5. HTTP Interceptor for Authentication
```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token if available
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Redirect to login on unauthorized
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

// auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = signal(false);
  private currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly authenticated = this.isAuthenticated.asReadonly();

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticated.set(true);
      // Decode user from token or fetch from API
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

## Usage Examples

### Using the Components
```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  imports: [
    UserProfileComponent,
    DataTableComponent,
    ContactFormComponent
  ],
  template: `
    <!-- User Profile -->
    <app-user-profile [userData]="currentUser"></app-user-profile>

    <!-- Data Table -->
    <app-data-table 
      [tableData]="users" 
      [tableColumns]="userColumns">
    </app-data-table>

    <!-- Contact Form -->
    <app-contact-form></app-contact-form>
  `
})
export class AppComponent {
  currentUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true
  };

  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ];

  userColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'role', label: 'Role', sortable: true }
  ];
}
```

These examples demonstrate real-world Angular v20 patterns using signals, standalone components, and modern practices. Each component is self-contained and can be easily integrated into any Angular v20 application.