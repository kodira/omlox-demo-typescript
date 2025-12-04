# Omlox Angular Client

A custom TypeScript Angular client for the omlox Hub API with proper Bearer authentication support.

## Features

- ✅ Native Angular services using HttpClient
- ✅ Proper Bearer token authentication
- ✅ Full TypeScript support with typed models
- ✅ Observable-based API
- ✅ Comprehensive error handling
- ✅ Modular architecture
- ✅ Ready for NPM publishing

## Installation

```bash
npm install @omlox/angular-client
```

## Usage

### 1. Import the module

```typescript
import { OmloxClientModule } from '@omlox/angular-client';

@NgModule({
  imports: [
    OmloxClientModule.forRoot({
      baseUrl: 'https://your-omlox-hub.com/api'
    })
  ]
})
export class AppModule {}
```

### 2. Use in your services

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OmloxTrackablesService, OmloxBaseService, Trackable } from '@omlox/angular-client';

@Injectable()
export class YourService {
  constructor(
    private trackablesService: OmloxTrackablesService,
    private baseService: OmloxBaseService
  ) {}

  setupAuth(token: string): void {
    this.baseService.setBearerToken(token);
  }

  getTrackables(): Observable<Trackable[]> {
    return this.trackablesService.getAllTrackables();
  }
}
```

## Available Services

- `OmloxTrackablesService` - Trackable management
- `OmloxFencesService` - Fence and collision management  
- `OmloxZonesService` - Zone management
- `OmloxProvidersService` - Location provider management
- `OmloxBaseService` - Base service with authentication

## Authentication

The client uses Bearer token authentication. Set the token using:

```typescript
baseService.setBearerToken('your-jwt-token');
```

The token will be automatically included in all subsequent API requests.

## Models

All omlox data models are fully typed:

```typescript
import { 
  Trackable, 
  Fence, 
  Zone, 
  Location, 
  TrackableMotion 
} from '@omlox/angular-client';
```