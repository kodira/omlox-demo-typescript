# OMLOX Client - Usage Examples

This document provides comprehensive examples of how to use the OMLOX client with Angular's standalone pattern.

## Basic Setup

### 1. Application Configuration

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideOmloxClient } from '../omlox-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideOmloxClient({
      baseUrl: 'https://demo.coriva.io/corivahub/v2',
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  ]
};
```

### 2. Component Usage

```typescript
// src/app/tracking.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  OmloxTrackablesService, 
  OmloxZonesService,
  OmloxFencesService,
  Trackable,
  Zone,
  Fence 
} from '../omlox-client';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-dashboard">
      <h1>OMLOX Tracking Dashboard</h1>
      
      <section class="trackables">
        <h2>Trackables ({{ trackables().length }})</h2>
        @for (trackable of trackables(); track trackable.id) {
          <div class="card">
            <h3>{{ trackable.name || trackable.id }}</h3>
            <p>Type: {{ trackable.type }}</p>
            @if (trackable.radius) {
              <p>Radius: {{ trackable.radius }}m</p>
            }
          </div>
        }
        @empty {
          <p>No trackables found.</p>
        }
      </section>
      
      <section class="zones">
        <h2>Zones ({{ zones().length }})</h2>
        @for (zone of zones(); track zone.id) {
          <div class="card">
            <h3>{{ zone.name || zone.id }}</h3>
            <p>Type: {{ zone.type }}</p>
            @if (zone.description) {
              <p>{{ zone.description }}</p>
            }
          </div>
        }
      </section>
      
      <section class="fences">
        <h2>Fences ({{ fences().length }})</h2>
        @for (fence of fences(); track fence.id) {
          <div class="card">
            <h3>{{ fence.name || fence.id }}</h3>
            <p>Region: {{ fence.region?.type || 'Unknown' }}</p>
            @if (fence.radius) {
              <p>Radius: {{ fence.radius }}m</p>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .tracking-dashboard {
      padding: 20px;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
      background: #f9f9f9;
    }
    section {
      margin: 20px 0;
    }
  `]
})
export class TrackingComponent implements OnInit {
  private trackablesService = inject(OmloxTrackablesService);
  private zonesService = inject(OmloxZonesService);
  private fencesService = inject(OmloxFencesService);
  
  trackables = signal<Trackable[]>([]);
  zones = signal<Zone[]>([]);
  fences = signal<Fence[]>([]);
  
  ngOnInit() {
    this.loadData();
  }
  
  private loadData() {
    // Load all trackables
    this.trackablesService.getAllTrackables().subscribe({
      next: (trackables) => this.trackables.set(trackables),
      error: (error) => console.error('Failed to load trackables:', error)
    });
    
    // Load all zones
    this.zonesService.getAllZones().subscribe({
      next: (zones) => this.zones.set(zones),
      error: (error) => console.error('Failed to load zones:', error)
    });
    
    // Load all fences
    this.fencesService.getAllFences().subscribe({
      next: (fences) => this.fences.set(fences),
      error: (error) => console.error('Failed to load fences:', error)
    });
  }
}
```

## Advanced Usage Patterns

### 1. Service with Authentication

```typescript
// src/app/services/omlox-auth.service.ts
import { Injectable, inject } from '@angular/core';
import { OmloxBaseService } from '../../omlox-client';

@Injectable({
  providedIn: 'root'
})
export class OmloxAuthService {
  private baseService = inject(OmloxBaseService);
  
  setAuthToken(token: string) {
    this.baseService.setBearerToken(token);
  }
  
  clearAuth() {
    this.baseService.setBearerToken(null);
  }
}
```

### 2. Real-time Tracking Component

```typescript
// src/app/realtime-tracking.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { interval, switchMap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { OmloxTrackablesService, TrackableMotion } from '../omlox-client';

@Component({
  selector: 'app-realtime-tracking',
  standalone: true,
  template: `
    <div class="realtime-dashboard">
      <h2>Real-time Tracking</h2>
      <div class="controls">
        <button (click)="toggleTracking()">
          {{ isTracking() ? 'Stop' : 'Start' }} Tracking
        </button>
        <span>Update interval: {{ updateInterval }}ms</span>
      </div>
      
      @for (motion of motions(); track motion.id) {
        <div class="motion-card">
          <h3>Trackable: {{ motion.id }}</h3>
          <p>Position: [{{ motion.location.position.coordinates.join(', ') }}]</p>
          <p>Provider: {{ motion.location.provider_type }}</p>
          @if (motion.location.accuracy) {
            <p>Accuracy: ±{{ motion.location.accuracy }}m</p>
          }
          @if (motion.location.speed) {
            <p>Speed: {{ motion.location.speed }}m/s</p>
          }
        </div>
      }
    </div>
  `
})
export class RealtimeTrackingComponent implements OnInit, OnDestroy {
  private trackablesService = inject(OmloxTrackablesService);
  private destroy$ = new Subject<void>();
  
  motions = signal<TrackableMotion[]>([]);
  isTracking = signal(false);
  updateInterval = 2000; // 2 seconds
  
  ngOnInit() {
    this.startTracking();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleTracking() {
    if (this.isTracking()) {
      this.stopTracking();
    } else {
      this.startTracking();
    }
  }
  
  private startTracking() {
    this.isTracking.set(true);
    
    interval(this.updateInterval)
      .pipe(
        switchMap(() => this.trackablesService.getAllTrackables()),
        switchMap(trackables => {
          // Get motion for each trackable
          const motionRequests = trackables.map(t => 
            this.trackablesService.getTrackableMotion(t.id)
          );
          return Promise.all(motionRequests);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (motions) => this.motions.set(motions),
        error: (error) => console.error('Tracking error:', error)
      });
  }
  
  private stopTracking() {
    this.isTracking.set(false);
    this.destroy$.next();
  }
}
```

### 3. Feature-specific Configuration

```typescript
// src/app/features/warehouse/warehouse.routes.ts
import { Routes } from '@angular/router';
import { provideOmloxClient } from '../../../omlox-client';

export const warehouseRoutes: Routes = [
  {
    path: '',
    providers: [
      // Feature-specific OMLOX configuration
      provideOmloxClient({
        baseUrl: 'https://warehouse-api.example.com',
        defaultHeaders: {
          'X-Warehouse-ID': 'warehouse-001'
        }
      })
    ],
    children: [
      {
        path: 'tracking',
        loadComponent: () => import('./tracking/warehouse-tracking.component')
      },
      {
        path: 'zones',
        loadComponent: () => import('./zones/warehouse-zones.component')
      }
    ]
  }
];
```

## Error Handling

```typescript
// src/app/services/omlox-error.service.ts
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmloxErrorService {
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // You could send the error to a logging service here
      this.logError(operation, error);
      
      // Let the app keep running by returning a safe result
      return throwError(() => error);
    };
  }
  
  private logError(operation: string, error: any) {
    // Implement your logging strategy here
    console.error('OMLOX Error:', { operation, error });
  }
}
```

## Testing

```typescript
// src/app/tracking.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideOmloxClient } from '../omlox-client';
import { TrackingComponent } from './tracking.component';

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingComponent],
      providers: [
        provideOmloxClient({
          baseUrl: 'http://test-api.example.com'
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Key Benefits

1. **Tree Shaking**: Only the services you inject are included in your bundle
2. **Lazy Loading**: Configure OMLOX per route or feature
3. **Type Safety**: Full TypeScript support with exact OpenAPI documentation
4. **Modern Angular**: Uses latest Angular patterns and features
5. **Testing**: Easy to test with dependency injection