# TapReview Design System

**Version:** 1.0  
**Last Updated:** 2024-01-XX  
**Design Philosophy:** Glossy Minimal Sci-Fi

---

## Overview

TapReview's design system embodies the premium, technological nature of our NFC review cards. The visual language communicates precision, craftsmanship, and quiet confidence.

**Core Principles:**
- Less, but better
- Premium physical product feel
- Technological sophistication
- Restrained use of effects
- Mobile-first responsive design

---

## Color Palette

### Background
```css
--color-background: #0a0a0b;  /* Deep near-black */
```

### Surface
```css
--color-card: #111113;         /* Card backgrounds */
--color-card-hover: #161618;   /* Card hover state */
```

### Borders
```css
--color-border: #1f1f23;       /* Standard borders */
--color-border-light: #2a2a2e; /* Lighter borders */
```

### Accent (Cyan/Tech)
```css
--color-accent: #06b6d4;       /* Primary accent */
--color-accent-light: #22d3ee; /* Light accent */
--color-accent-dark: #0891b2;  /* Dark accent */
--color-accent-glow: rgba(6, 182, 212, 0.15); /* Glow effect */
```

### Status Colors
```css
--color-success: #10b981;  /* Green - Active, Success */
--color-warning: #f59e0b;  /* Amber - Warning, Pending */
--color-error: #ef4444;    /* Red - Error, Suspended */
--color-info: #3b82f6;     /* Blue - Information */
```

### Text
```css
--color-foreground: #fafafa;  /* Primary text */
--color-muted: #71717a;       /* Secondary text */
--color-muted-light: #a1a1aa; /* Tertiary text */
```

---

## Typography

### Font Family
**Primary:** Inter  
**Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### Font Weights
- 300 - Light (rarely used)
- 400 - Regular (body text)
- 500 - Medium (labels, metadata)
- 600 - Semibold (buttons, emphasis)
- 700 - Bold (headings)
- 800 - Extra bold (large headings)

### Type Scale

#### Display XL (Hero Headings)
```css
font-size: clamp(2.5rem, 8vw, 4rem);
line-height: 1.1;
font-weight: 700;
letter-spacing: -0.02em;
```

#### Display LG (Page Titles)
```css
font-size: clamp(1.75rem, 6vw, 2.5rem);
line-height: 1.2;
font-weight: 700;
letter-spacing: -0.02em;
```

#### H1 (Section Titles)
```css
font-size: 2rem;
line-height: 1.3;
font-weight: 700;
```

#### H2 (Card Titles)
```css
font-size: 1.5rem;
line-height: 1.4;
font-weight: 600;
```

#### H3 (Subsection Titles)
```css
font-size: 1.25rem;
line-height: 1.4;
font-weight: 600;
```

#### Body Large
```css
font-size: 1.125rem;
line-height: 1.6;
font-weight: 400;
```

#### Body
```css
font-size: 1rem;
line-height: 1.6;
font-weight: 400;
```

#### Body Small
```css
font-size: 0.875rem;
line-height: 1.5;
font-weight: 400;
```

#### Caption
```css
font-size: 0.75rem;
line-height: 1.5;
font-weight: 500;
```

#### Code
```css
font-family: 'JetBrains Mono', monospace;
font-size: 0.875rem;
line-height: 1.5;
```

---

## Spacing

### Base Unit
4px (0.25rem)

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Common Spacing Patterns

#### Card Padding
```css
padding: 1.5rem;  /* 24px */
```

#### Section Padding
```css
padding: 5rem 1.25rem;  /* 80px vertical, 20px horizontal */
```

#### Component Gap
```css
gap: 1rem;  /* 16px between related elements */
gap: 1.5rem;  /* 24px between sections */
```

---

## Border Radius

### Scale
```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Modals */
--radius-full: 9999px;   /* Pills, badges */
```

### Usage
- **Buttons:** `rounded-xl` (12px)
- **Cards:** `rounded-xl` (12px)
- **Inputs:** `rounded-xl` (12px)
- **Badges:** `rounded-full` (9999px)
- **Modals:** `rounded-2xl` (24px)
- **Avatars:** `rounded-full` (9999px)

---

## Shadows

### Premium Shadow
```css
box-shadow: 
  0 0 0 1px rgba(255, 255, 255, 0.05),
  0 4px 6px -1px rgba(0, 0, 0, 0.5),
  0 2px 4px -1px rgba(0, 0, 0, 0.3);
```

### Glow Shadow
```css
box-shadow: 0 0 60px rgba(6, 182, 212, 0.2);
```

### Small Glow
```css
box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
```

### Usage
- **Cards:** `shadow-premium`
- **Accent elements:** `shadow-glow`
- **Hover states:** `shadow-glow-sm`

---

## Borders

### Standard Border
```css
border: 1px solid var(--color-border);
```

### Light Border
```css
border: 1px solid var(--color-border-light);
```

### Accent Border
```css
border: 1px solid var(--color-accent);
```

### Usage
- **Cards:** `border border-border`
- **Inputs:** `border border-border`
- **Active states:** `border-accent`

---

## Components

### Button

#### Primary Button
```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

**Styles:**
- Background: `var(--color-accent)`
- Text: White
- Padding: `12px 24px`
- Border radius: `12px`
- Hover: Lighter accent + glow shadow
- Disabled: 50% opacity

#### Secondary Button
```tsx
<Button variant="secondary" size="md">
  Cancel
</Button>
```

**Styles:**
- Background: `var(--color-card)`
- Border: `1px solid var(--color-border)`
- Text: `var(--color-foreground)`
- Hover: `var(--color-card-hover)`

#### Ghost Button
```tsx
<Button variant="ghost" size="md">
  Learn More
</Button>
```

**Styles:**
- Background: Transparent
- Border: `1px solid var(--color-border)`
- Text: `var(--color-foreground)`
- Hover: `var(--color-card-hover)`

#### Sizes
```tsx
<Button size="sm">Small</Button>   // px-3 py-1.5 text-sm
<Button size="md">Medium</Button>  // px-4 py-2.5 text-sm
<Button size="lg">Large</Button>   // px-6 py-3 text-base
```

---

### Input

```tsx
<Input
  label="Username"
  type="text"
  placeholder="your-username"
  error="Username is required"
/>
```

**Styles:**
- Background: `var(--color-card)`
- Border: `1px solid var(--color-border)`
- Padding: `14px 16px`
- Border radius: `12px`
- Focus: `border-accent` + glow ring
- Error: `border-error`

---

### Card

```tsx
<Card hover>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Styles:**
- Background: `var(--color-card)`
- Border: `1px solid var(--color-border)`
- Border radius: `12px`
- Padding: `24px`
- Hover (optional): Lift + glow border

---

### Badge

```tsx
<Badge variant="success">
  <StatusDot status="active" />
  Active
</Badge>
```

**Variants:**
- `success` - Green background, green text
- `warning` - Amber background, amber text
- `error` - Red background, red text
- `info` - Blue background, blue text
- `default` - Card background, foreground text

**Styles:**
- Padding: `4px 10px`
- Border radius: `9999px`
- Font size: `12px`
- Font weight: `500`

---

### Status Dot

```tsx
<StatusDot status="active" />
```

**Statuses:**
- `active` - Green with glow
- `suspended` - Red with glow
- `unassigned` - Gray, no glow
- `retired` - Gray, no glow

**Styles:**
- Size: `8px × 8px`
- Border radius: `50%`
- Active/Suspended: Box shadow glow

---

### Modal

```tsx
<Modal isOpen={true} onClose={() => {}} title="Edit Card">
  <div className="p-6">
    Content
  </div>
</Modal>
```

**Styles:**
- Background: `var(--color-card)`
- Border: `1px solid var(--color-border)`
- Border radius: `24px`
- Max width: `32rem` (md), `48rem` (lg)
- Backdrop: `bg-background/80 backdrop-blur-sm`
- Animation: Scale in

---

### NFC Card Component

```tsx
<NFCCard
  cardId="JOCK-A7F92K"
  label="Main Counter"
  status="active"
  destinationUrl="https://g.page/r/business"
  totalScans={1247}
  todayScans={47}
  onEdit={() => {}}
/>
```

**Features:**
- Displays card ID with copy button
- Status badge with dot indicator
- Destination URL (clickable)
- Scan statistics
- Edit destination button
- Hover effects

---

## Glass Effects

### Standard Glass
```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Strong Glass
```css
.glass-strong {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

**Usage:**
- Navigation: `glass-strong`
- Overlays: `glass`
- Modals: `glass-strong`

---

## Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}
```

### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
  50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.5); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

**Usage:**
- Page load: `animate-fade-in`
- Content reveal: `animate-slide-up`
- Modals: `animate-scale-in`
- Success indicators: `animate-pulse-glow`

---

## Responsive Design

### Breakpoints
```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Laptop */
xl: 1280px   /* Desktop */
2xl: 1536px  /* Large desktop */
```

### Mobile-First Approach
All components are designed mobile-first, then enhanced for larger screens.

#### Navigation
- **Mobile:** Hamburger menu + slide-out sidebar
- **Desktop:** Fixed sidebar (264px width)

#### Cards
- **Mobile:** Single column, full width
- **Tablet:** 2 columns
- **Desktop:** 3-4 columns

#### Typography
- **Mobile:** Smaller headings, larger touch targets
- **Desktop:** Larger headings, more whitespace

---

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- Primary text: 4.5:1 contrast ratio
- Secondary text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

### Focus States
All interactive elements have visible focus states:
```css
focus:ring-2 focus:ring-accent focus:ring-offset-2
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order is logical
- Escape closes modals
- Enter/Space activates buttons

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Status messages announced
- Form labels properly associated

---

## Iconography

### Icon Library
**Lucide React** - Consistent, geometric icons

### Icon Sizes
```tsx
<Icon className="w-3 h-3" />   // Small (12px)
<Icon className="w-4 h-4" />   // Medium (16px)
<Icon className="w-5 h-5" />   // Large (20px)
<Icon className="w-6 h-6" />   // XL (24px)
```

### Icon Colors
- **Default:** `text-muted`
- **Interactive:** `text-foreground`
- **Accent:** `text-accent`
- **Success:** `text-success`
- **Error:** `text-error`

---

## Motion Principles

### Duration
- **Fast:** 150ms (micro-interactions)
- **Normal:** 300ms (standard transitions)
- **Slow:** 500ms (page transitions)

### Easing
```css
ease-out      /* Entering elements */
ease-in       /* Exiting elements */
ease-in-out   /* Transformations */
```

### Guidelines
- Use motion to communicate state changes
- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion`
- Never animate for decoration alone

---

## Dark Mode

The entire design system is built for dark mode. Light mode is not currently supported.

**Rationale:**
- Premium technological aesthetic
- Better for OLED screens
- Reduces eye strain
- Matches physical product feel

---

## Best Practices

### Do's
✅ Use consistent spacing from the scale  
✅ Follow the type hierarchy  
✅ Use status indicators with text labels  
✅ Provide loading states for all async operations  
✅ Use glass effects sparingly  
✅ Test on mobile devices  
✅ Maintain sufficient color contrast  

### Don'ts
❌ Use excessive gradients  
❌ Add decorative elements without purpose  
❌ Use more than 2 font families  
❌ Ignore mobile responsiveness  
❌ Use color alone to convey information  
❌ Overuse animations  
❌ Create inconsistent spacing  

---

## Component Examples

### Success Message
```tsx
<div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
  <Check className="w-5 h-5 text-success" />
  <p className="text-sm text-success">Destination updated successfully</p>
</div>
```

### Error Message
```tsx
<div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3">
  <AlertCircle className="w-5 h-5 text-error" />
  <p className="text-sm text-error flex-1">Failed to update destination</p>
  <button onClick={() => setError('')}>
    <X className="w-4 h-4 text-error" />
  </button>
</div>
```

### Loading State
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
  <p className="text-muted text-sm">Loading...</p>
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
    <Wifi className="w-6 h-6 text-muted" />
  </div>
  <h3 className="text-lg font-semibold text-foreground mb-2">No cards yet</h3>
  <p className="text-muted text-sm text-center max-w-md mb-6">
    Cards assigned to your business will appear here.
  </p>
</div>
```

---

## Future Enhancements

### Potential Additions
- Light mode support
- More accent color options
- Advanced animation library
- Component storybook
- Design token export
- Figma component library

### Considerations
- Maintain consistency with existing design
- Ensure accessibility standards
- Test across all devices
- Document all changes

---

**Document Status:** COMPLETE  
**Version:** 1.0  
**Last Updated:** 2024-01-XX
