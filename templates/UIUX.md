# UIUX.md

## User Interface & Experience Patterns

### Overview
[Brief description of UI/UX philosophy and principles]

## Navigation Patterns

### Primary Navigation
```javascript
// Navigation structure
const navigation = {
  main: [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Dashboard', path: '/dashboard', icon: 'chart' },
    { label: 'Projects', path: '/projects', icon: 'folder' },
    { label: 'Settings', path: '/settings', icon: 'cog' }
  ],
  user: [
    { label: 'Profile', path: '/profile' },
    { label: 'Logout', action: 'logout' }
  ]
};
```

### Breadcrumb Pattern
```
Home > Projects > Project Name > Settings
```

## Component Behaviors

### Loading States
```javascript
// Three-stage loading pattern
const LoadingStates = {
  SKELETON: 'Show skeleton UI immediately',
  SPINNER: 'Show spinner after 300ms',
  ERROR: 'Show error after timeout'
};
```

### Form Interactions
```javascript
// Real-time validation
- Validate on blur
- Show inline errors
- Disable submit until valid
- Show success feedback

// Auto-save pattern
- Save after 2 seconds of inactivity
- Show "Saving..." indicator
- Confirm when saved
```

### Modal Behaviors
```javascript
// Modal guidelines
- Trap focus within modal
- Close on ESC key
- Close on backdrop click (optional)
- Animate in/out
- Return focus to trigger element
```

## State Management

### Component States
```typescript
interface ComponentStates {
  default: 'Normal resting state';
  hover: 'Mouse over state';
  active: 'Being clicked/tapped';
  focus: 'Keyboard navigation';
  disabled: 'Not interactive';
  loading: 'Processing action';
  error: 'Error occurred';
  success: 'Action completed';
}
```

### Data States
```typescript
interface DataStates {
  empty: 'No data to display';
  loading: 'Fetching data';
  error: 'Failed to load';
  partial: 'Some data loaded';
  complete: 'All data loaded';
  stale: 'Data needs refresh';
}
```

## User Flows

### Authentication Flow
```
1. Landing Page
   ├─> Sign Up
   │   ├─> Email Verification
   │   └─> Onboarding
   └─> Sign In
       ├─> Dashboard
       └─> Forgot Password
           └─> Reset Email
```

### Purchase Flow
```
1. Product Browse
2. Product Detail
3. Add to Cart
4. Cart Review
5. Checkout
   ├─> Guest Checkout
   └─> Account Creation
6. Payment
7. Confirmation
```

## Interaction Patterns

### Drag and Drop
```javascript
// Drag feedback
- Show drag preview
- Highlight drop zones
- Show invalid drop areas
- Animate on drop
- Provide keyboard alternative
```

### Infinite Scroll
```javascript
// Implementation pattern
- Load initial 20 items
- Trigger at 80% scroll
- Show loading indicator
- Handle errors gracefully
- Provide "Load More" fallback
```

### Search Patterns
```javascript
// Instant search
- Debounce input (300ms)
- Show loading state
- Display results dropdown
- Highlight matches
- Recent searches
- Keyboard navigation
```

## Responsive Behaviors

### Mobile Adaptations
```javascript
// Touch-friendly adjustments
- Minimum tap target: 44x44px
- Swipe gestures for navigation
- Bottom sheet instead of dropdown
- Simplified navigation
- Thumb-friendly button placement
```

### Breakpoint Behaviors
```
Mobile (< 768px):
- Stack layout
- Full-width buttons
- Collapsed navigation
- Swipe gestures

Tablet (768px - 1024px):
- Two-column layout
- Side navigation
- Touch-optimized

Desktop (> 1024px):
- Multi-column layout
- Hover states
- Keyboard shortcuts
```

## Accessibility Patterns

### Keyboard Navigation
```javascript
// Key bindings
- Tab: Next element
- Shift+Tab: Previous element
- Enter/Space: Activate
- Escape: Close/Cancel
- Arrow keys: Navigate options
```

### Screen Reader Support
```html
<!-- Landmarks -->
<nav role="navigation" aria-label="Main">
<main role="main">
<aside role="complementary">

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true">
  Status updates here
</div>

<!-- Labels -->
<button aria-label="Close dialog">×</button>
```

### Focus Management
```javascript
// Focus trap for modals
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

## Performance Patterns

### Optimistic UI
```javascript
// Update UI before server confirms
1. User clicks "Like"
2. Immediately show liked state
3. Send request to server
4. If error, revert state
5. Show error message
```

### Progressive Enhancement
```
1. Core HTML functionality
2. CSS enhancements
3. JavaScript interactions
4. Advanced features for modern browsers
```

### Lazy Loading
```javascript
// Image lazy loading
<img loading="lazy" src="image.jpg" />

// Component lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## Error Handling

### Error States
```javascript
// User-friendly error messages
{
  404: "We couldn't find that page",
  500: "Something went wrong on our end",
  offline: "You appear to be offline",
  timeout: "This is taking longer than usual"
}
```

### Recovery Actions
```javascript
// Provide clear next steps
- Retry button
- Go back option
- Contact support link
- Alternative suggestions
```

## Keywords <!-- #keywords -->
- user interface
- user experience
- interaction design
- navigation
- accessibility
- responsive design