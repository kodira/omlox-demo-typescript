# OMLOX Angular Client - Compatibility Matrix

## Angular Version Requirements

| OMLOX Client Version | Angular Version | Features | Support Status |
|---------------------|-----------------|----------|----------------|
| 2.1.0+ | 16.0.0+ | Standalone + Module | ✅ **Recommended** |
| 2.0.0 | 15.0.0+ | Module-based only | ⚠️ Legacy |
| 1.x.x | 14.0.0+ | Module-based only | ❌ Deprecated |

## Feature Compatibility

### Standalone Features (Angular 16+)
- ✅ `provideOmloxClient()` - Main provider function
- ✅ `provideOmloxServices()` - Services-only provider
- ✅ `makeEnvironmentProviders()` - Environment providers
- ✅ `InjectionToken<T>` - Type-safe injection tokens
- ✅ Tree-shaking optimizations
- ✅ Lazy loading per route/feature

### Legacy Module Support (Angular 15+)
- ✅ `OmloxClientModule.forRoot()` - **Deprecated**
- ⚠️ Limited tree-shaking
- ⚠️ Larger bundle sizes

## Migration Path

### From Angular 15 to 16+
```typescript
// Before (Angular 15)
providers: [
  importProvidersFrom(OmloxClientModule.forRoot(config))
]

// After (Angular 16+) 
providers: [
  provideOmloxClient(config)
]
```

## Angular Feature Dependencies

The standalone conversion requires these Angular features:

### Required (Angular 16+)
- `makeEnvironmentProviders()` - For creating environment providers
- `EnvironmentProviders` type - For provider typing
- `provideHttpClient()` - For HTTP client provisioning
- `InjectionToken<T>` - For type-safe dependency injection

### Optional Enhancements (Angular 16+)
- Improved tree-shaking for providers
- Better standalone component support
- Enhanced `inject()` function capabilities

## Testing Compatibility

### Angular 16+
```typescript
TestBed.configureTestingModule({
  providers: [
    provideOmloxClient({ baseUrl: 'http://test.example.com' })
  ]
});
```

### Angular 15 (Legacy)
```typescript
TestBed.configureTestingModule({
  imports: [
    OmloxClientModule.forRoot({ baseUrl: 'http://test.example.com' })
  ]
});
```

## Package Manager Compatibility

| Package Manager | Angular 16+ | Angular 15 | Notes |
|----------------|-------------|------------|-------|
| npm 8+ | ✅ | ✅ | Full compatibility |
| yarn 3+ | ✅ | ✅ | Full compatibility |
| pnpm 7+ | ✅ | ✅ | Full compatibility |

## Browser Support

The OMLOX client supports the same browsers as Angular:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions) 
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Upgrade Recommendations

### Immediate (Recommended)
- **Angular 16+**: Full standalone support with all optimizations
- **RxJS 7.5+**: Better tree-shaking and performance

### Future Planning
- **Angular 17+**: Enhanced control flow syntax (`@if`, `@for`)
- **Angular 18+**: New application builder and zoneless change detection
- **Angular 19+**: Material 3 design system integration

## Version Support Policy

- **Current (2.1.0+)**: Active development, new features
- **Legacy (2.0.0)**: Security fixes only
- **Deprecated (1.x.x)**: No support

## Breaking Changes

### v2.0.0 → v2.1.0
- ✅ **Non-breaking**: Added standalone providers
- ✅ **Non-breaking**: Maintained module compatibility
- ⚠️ **Deprecation**: `OmloxClientModule` marked deprecated

### Future v3.0.0 (Planned)
- ❌ **Breaking**: Remove `OmloxClientModule` 
- ❌ **Breaking**: Require Angular 18+
- ✅ **Enhancement**: Native signals support