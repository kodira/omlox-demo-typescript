# OMLOX Client - Standalone Migration Guide

The OMLOX client has been updated to support Angular's modern standalone pattern. This provides better tree-shaking, smaller bundle sizes, and improved developer experience.

## Quick Migration

### Before (Module-based)

```typescript
// app.module.ts
import { OmloxClientModule } from './omlox-client';

@NgModule({
    imports: [
        OmloxClientModule.forRoot({
            baseUrl: 'https://api.example.com',
            defaultHeaders: { 'X-API-Version': '2.0' },
        }),
    ],
})
export class AppModule {}
```

### After (Standalone)

```typescript
// main.ts
import { provideOmloxClient } from './omlox-client';

bootstrapApplication(AppComponent, {
    providers: [
        provideOmloxClient({
            baseUrl: 'https://api.example.com',
            defaultHeaders: { 'X-API-Version': '2.0' },
        }),
    ],
});
```

## Usage Patterns

### 1. Application-wide Configuration

Configure OMLOX client for the entire application:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideOmloxClient } from './omlox-client';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideOmloxClient({
            baseUrl: 'https://e.coriva.io/corivahub/v2',
            defaultHeaders: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }),
    ],
});
```

### 2. Feature-level Configuration

Configure OMLOX client for specific routes or features:

```typescript
// routes.ts
import { Routes } from '@angular/router';
import { provideOmloxClient } from './omlox-client';

export const routes: Routes = [
    {
        path: 'tracking',
        providers: [
            provideOmloxClient({
                baseUrl: 'https://tracking-api.example.com',
            }),
        ],
        loadComponent: () => import('./tracking/tracking.component'),
    },
];
```

### 3. Services-only (No Configuration)

Provide services without configuration (when config comes from elsewhere):

```typescript
// feature.routes.ts
import { provideOmloxServices } from './omlox-client';

export const routes: Routes = [
    {
        path: 'dashboard',
        providers: [provideOmloxServices()],
        loadComponent: () => import('./dashboard.component'),
    },
];
```

## Component Usage

Components remain unchanged - services are injected the same way:

```typescript
// tracking.component.ts
import { Component, inject } from '@angular/core';
import { OmloxTrackablesService } from './omlox-client';

@Component({
    selector: 'app-tracking',
    standalone: true,
    template: `
        <div>
            <h2>Trackables</h2>
            @for (trackable of trackables(); track trackable.id) {
            <div>{{ trackable.name }}</div>
            }
        </div>
    `,
})
export class TrackingComponent {
    private trackablesService = inject(OmloxTrackablesService);

    trackables = signal<Trackable[]>([]);

    ngOnInit() {
        this.trackablesService
            .getAllTrackables()
            .subscribe((trackables) => this.trackables.set(trackables));
    }
}
```

## Benefits of Standalone Approach

1. **Better Tree Shaking**: Only import what you need
2. **Smaller Bundle Size**: No unnecessary module overhead
3. **Improved DX**: More explicit dependencies
4. **Future Proof**: Aligns with Angular's direction
5. **Lazy Loading**: Easier to configure per-route

## Legacy Support

The old `OmloxClientModule` is still available but marked as deprecated. It will be removed in a future major version.

## Migration Checklist

-   [ ] Replace `OmloxClientModule.forRoot()` with `provideOmloxClient()`
-   [ ] Update imports to use new provider functions
-   [ ] Test that all services work correctly
-   [ ] Consider feature-level configuration for better performance
-   [ ] Update documentation and examples
