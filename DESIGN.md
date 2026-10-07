## Page to Generate: Order Receipt

Show completed sale receipt with order ID, items, total, payment method, and options to email or reprint.

## Flow Context

Direct sale(POS)

## Available Page Links for Navigation

Use these exact URLs for navigation links between pages in this flow:

- "Inventory Pro | Sales Management": https://p.superdesign.dev/draft/b75e639b-910a-46c2-b13c-546b859acd56
- "Direct sale (POS)": https://p.superdesign.dev/draft/4c808027-013b-400d-881a-2e4349ec0d52
- "POS Cart": https://p.superdesign.dev/draft/4b47d1aa-640a-4260-8d59-283767b6b338
- "Payment Processing": https://p.superdesign.dev/draft/299796f0-7d8d-4722-8307-b531518cb3d0
- "Order Receipt" (current page): https://p.superdesign.dev/draft/43954862-da29-4d1c-8f2c-bf65f5db4deb
- "Customer Lookup": https://p.superdesign.dev/draft/13f98272-7258-4929-9e99-3f09df5c4150
- "Inventory Selection": https://p.superdesign.dev/draft/425cb4c1-abe9-49e9-9202-ac8dcd3b3191
- "Sales Summary": https://p.superdesign.dev/draft/423dd76a-3b89-465d-9dcd-e6f4f6e57029
- "POS Dashboard": https://p.superdesign.dev/draft/53396a66-ede8-4145-b4ea-1665c2d1d9f2
- "Product Quick Add": https://p.superdesign.dev/draft/a6da4830-13a0-4f6b-a9ef-f2515b3b77ef
- "Discount Application": https://p.superdesign.dev/draft/22b9548b-fab3-4324-9b48-9af4b85f031a
- "Transaction History": https://p.superdesign.dev/draft/89c5af1e-3684-42cf-9ee4-d406a94e0a2e

**Navigation Link Instructions:**

1. For <a> tags that navigate between pages in this flow, use the URLs above as href values
2. Mark the current page as "active" in navigation elements (add "active" class or similar styling)
3. The navigation should allow users to move between all pages in this flow
4. Keep all other links (external, social media, etc.) unchanged from the source

## Semantic Hash Placeholders for Future Links

For links to pages that are NOT listed above (pages not yet created or outside this flow), use semantic hash placeholders in kebab-case format:

**Common Placeholders:**

- Dashboard/Home: `#dashboard` or `#home`
- Settings: `#settings`
- Profile: `#profile` or `#user-profile`
- Notifications: `#notifications`
- Search: `#search`
- 

**Examples:**

~~~html
<a href="#settings" id="nav-settings-link">Settings</a>
<a href="#user-profile" id="nav-profile-link">Profile</a>
<a href="#billing" id="nav-billing-link">Billing</a>
~~~

These semantic hashes make it easy to search and replace when target pages are created later. Always use descriptive, meaningful names that reflect the destination page's purpose.

## Prefetch Optimization

Add these prefetch links in <head> to improve navigation performance:

~~~html
<link rel="prefetch" href="https://p.superdesign.dev/draft/b75e639b-910a-46c2-b13c-546b859acd56" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/4c808027-013b-400d-881a-2e4349ec0d52" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/4b47d1aa-640a-4260-8d59-283767b6b338" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/299796f0-7d8d-4722-8307-b531518cb3d0" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/43954862-da29-4d1c-8f2c-bf65f5db4deb" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/13f98272-7258-4929-9e99-3f09df5c4150" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/425cb4c1-abe9-49e9-9202-ac8dcd3b3191" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/423dd76a-3b89-465d-9dcd-e6f4f6e57029" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/53396a66-ede8-4145-b4ea-1665c2d1d9f2" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/a6da4830-13a0-4f6b-a9ef-f2515b3b77ef" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/22b9548b-fab3-4324-9b48-9af4b85f031a" as="document">
<link rel="prefetch" href="https://p.superdesign.dev/draft/89c5af1e-3684-42cf-9ee4-d406a94e0a2e" as="document">
~~~

This allows the browser to pre-load linked pages during idle time, making navigation nearly instant.

## CRITICAL: View Transition API - SPA-LIKE SMOOTH TRANSITIONS

**MANDATORY**: All flow pages MUST implement View Transition API for silky smooth page-to-page transitions.

### Step 1: Identify Persistent Elements in Source Page

Scan the source page for elements that should remain **unchanged** across pages:

- Navigation components (top nav, bottom tabs, side menu, breadcrumbs)
- Brand elements (logo, app title)
- Global UI (toolbars, status bars, floating buttons, dock)
- User context (profile widget, notifications badge)
- Any element with existing `view-transition-name` declarations

**Key test**: "Would this element look identical on other pages?" → If yes, it's persistent.

### Step 2: Implementation

1. **Enable View Transitions**: Add meta tag in <head>:\
   `<meta name="view-transition" content="same-origin">`

2. **CSS Setup** - Match source page's transition names:

   ~~~css
   /* Prevent white flash */
   html {
       background-color: #0a0a0a; /* Match page background */
   }
   @view-transition { navigation: auto; }
   ::view-transition { background-color: #0a0a0a; }
   
   /* For EACH persistent element found in source */
   /* Use the SAME view-transition-name as source page */
   ::view-transition-old([name]),
   ::view-transition-new([name]) {
       animation: none;
       mix-blend-mode: normal;
   }
   
   /* Dynamic content - animate */
   ::view-transition-old(main-content) {
       animation: 0.25s ease-out both fade-out;
   }
   ::view-transition-new(main-content) {
       animation: 0.25s ease-in 0.1s both fade-in;
   }
   
   @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
   @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
   
   ::view-transition-old(root),
   ::view-transition-new(root) {
       animation: none;
       mix-blend-mode: normal;
   }
   ~~~

3. **Apply view-transition-name**:

   - Copy ALL `view-transition-name` declarations from source page
   - Use the EXACT SAME names for corresponding elements
   - Always apply `main-content` to the primary dynamic area

### Examples

Source has nav + brand + content:

~~~html
<nav style="view-transition-name: main-nav"><!-- Copy exactly --></nav>
<div style="view-transition-name: brand"><!-- Copy exactly --></div>
<main style="view-transition-name: main-content"><!-- New content --></main>
~~~

Source has only content (no persistent UI):

~~~html
<main style="view-transition-name: main-content"><!-- All content --></main>
~~~

## CRITICAL: view-transition-name Alignment & Content Consistency

### Step 1: Identify Persistent vs Dynamic Elements

Analyze the source page and classify each major element:

**Persistent Elements** (should stay static during transitions):

- Elements that appear in the same position across multiple pages
- Elements whose content remains unchanged between pages
- Examples: navigation bars, brand logos, toolbars, status indicators, floating action buttons, breadcrumbs, user profile widgets, tab bars, dock menus

**Dynamic Elements** (should animate during transitions):

- Elements whose content changes based on the current page
- Page-specific content areas
- Examples: main content, page titles, article bodies, form content, data displays

**Key Question**: "Would this element's content be identical on the next page?"

- Yes → Persistent (apply view-transition-name, keep static)
- No → Dynamic (animate with crossfade)

### Step 2: Apply view-transition-name Based on Analysis

For each **persistent element** identified:

- Assign a semantic view-transition-name (e.g., `nav`, `brand`, `toolbar`, `user-widget`)
- Use descriptive names that reflect the element's purpose
- Add CSS rules to keep these elements static (no animation)

For the **primary dynamic area**:

- Apply `view-transition-name: main-content`
- This is typically the largest content area that changes between pages

**If NO persistent elements exist** (single-page designs, modals, focused UIs):

- Only apply `main-content` to the primary area
- Skip static element rules entirely

### Naming Requirements

- Match the EXACT names used in the source page if already defined
- Use the SAME declaration style (inline vs CSS class) as source
- Choose semantic, descriptive names for new transitions

### Content Consistency for Persistent Elements

**CRITICAL**: Elements sharing the same view-transition-name MUST have IDENTICAL content.

- Copy the HTML **exactly** from the source page
- Keep all text, icons, and structure identical
- Only **state indicators** (active tab, current page highlight) can differ

### Why This Matters

Identical content → Browser treats element as unchanged → Rock-solid, no morphing\
Different content → Browser morphs between states → Visible flickering/distortion

**WHY**: Persistent elements stay rock-solid. Only dynamic content crossfades. No white flash, no morphing artifacts.

## CRITICAL: Persistent Element Content MUST Be Identical

### Step 1: Identify Persistent Elements in Source Page

Scan the source for elements that should remain **unchanged** across pages:

**Common persistent elements** (not exhaustive):

- Navigation (top nav, bottom tabs, side menu, breadcrumbs, pagination)
- Brand (logo, app title, tagline)
- Global UI (toolbar, status bar, floating action button, dock, minimap)
- User context (profile widget, avatar, notifications, settings toggle)
- Decorative (background patterns, ambient animations)

**Key test**: "Would this element's content be identical on the next page?"

- Yes → Persistent element (must be copied exactly)
- No → Dynamic element (can change)

**Some pages have NO persistent elements** - that's perfectly valid for:

- Landing pages, single-purpose views, modals, focused task UIs

### Step 2: Rules for Persistent Elements

For EVERY persistent element identified:

- Copy the HTML **exactly** from the source page
- Keep all text, icons, structure identical
- Only **state indicators** can differ (active tab, current page highlight)

### Step 3: Page-Specific Content Placement

All page-specific content belongs in the **dynamic area** (main-content):

~~~html
<main style="view-transition-name: main-content">
    <!-- Page title, back button if needed -->
    <div class="page-header">
        <a href="./home.html">Back</a>
        <h1>Page Title</h1>
    </div>
    <!-- Page-specific content -->
</main>
~~~

### Why Content Must Be Identical

**Identical content** → Browser treats as unchanged → Rock-solid, no animation\
**Different content** → Browser morphs between states → Visible flickering

This is the fundamental principle of View Transitions: persistent elements stay put, only dynamic content animates.

## CRITICAL: Analyze Source Page First

### Step 1: Identify Persistent vs Dynamic Elements

Scan the source page and classify each major element:

**Persistent** (unchanged across pages):

- Elements with `view-transition-name` that disable animation
- Navigation, brand, toolbars, user widgets, status indicators, etc.
- Any element whose content would be identical on other pages

**Dynamic** (changes per page):

- Main content area
- Page-specific data, titles, forms

### Step 2: Preserve Persistent Elements Exactly

For EVERY persistent element found in source:

- Copy the EXACT same HTML structure
- Keep all text, icons, structure identical
- Only state indicators can differ (active tab, current highlight)

**WHY**: These pages belong to the SAME application flow. Inconsistent persistent elements break user experience and cause View Transition morphing artifacts.

## Visual Consistency Requirements

- Use the EXACT same color palette, typography, and spacing
- Follow the same component styling patterns
- Maintain the same responsive behavior and layout grid
- ONLY the dynamic area (main-content) should change

## CRITICAL: view-transition-name Alignment & Content Consistency

### Step 1: Identify Persistent vs Dynamic Elements

Analyze the source page and classify each major element:

**Persistent Elements** (should stay static during transitions):

- Elements that appear in the same position across multiple pages
- Elements whose content remains unchanged between pages
- Examples: navigation bars, brand logos, toolbars, status indicators, floating action buttons, breadcrumbs, user profile widgets, tab bars, dock menus

**Dynamic Elements** (should animate during transitions):

- Elements whose content changes based on the current page
- Page-specific content areas
- Examples: main content, page titles, article bodies, form content, data displays

**Key Question**: "Would this element's content be identical on the next page?"

- Yes → Persistent (apply view-transition-name, keep static)
- No → Dynamic (animate with crossfade)

### Step 2: Apply view-transition-name Based on Analysis

For each **persistent element** identified:

- Assign a semantic view-transition-name (e.g., `nav`, `brand`, `toolbar`, `user-widget`)
- Use descriptive names that reflect the element's purpose
- Add CSS rules to keep these elements static (no animation)

For the **primary dynamic area**:

- Apply `view-transition-name: main-content`
- This is typically the largest content area that changes between pages

**If NO persistent elements exist** (single-page designs, modals, focused UIs):

- Only apply `main-content` to the primary area
- Skip static element rules entirely

### Naming Requirements

- Match the EXACT names used in the source page if already defined
- Use the SAME declaration style (inline vs CSS class) as source
- Choose semantic, descriptive names for new transitions

### Content Consistency for Persistent Elements

**CRITICAL**: Elements sharing the same view-transition-name MUST have IDENTICAL content.

- Copy the HTML **exactly** from the source page
- Keep all text, icons, and structure identical
- Only **state indicators** (active tab, current page highlight) can differ

### Why This Matters

Identical content → Browser treats element as unchanged → Rock-solid, no morphing\
Different content → Browser morphs between states → Visible flickering/distortion

## What You CAN Change

- Main content area (primary dynamic section)
- Page-specific components within content area
- Content text and data
- Active state indicators on persistent elements

## What You CANNOT Change

- ANY element marked with `view-transition-name` (except main-content)
- Structure, text, icons of persistent elements
- Global CSS variables and theme colors
- View transition naming conventions from source

### Source Page HTML:

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Pro | Operations Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <meta name="view-transition" content="same-origin">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/56199e9e-8950-4670-bf15-f3dcd9d7fd60" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/6f4ab3e4-e9cc-4d29-b5ae-25e6b1e29063" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/975641fe-ae3d-4689-b82c-721cf688f324" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/e0b602e9-b61c-4427-95dd-729731d6ebe1" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/de542df0-a40f-418b-9354-f72f270f795b" as="document">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1a1a1a;
        }
        html { background-color: #F9F9FB; }
        @view-transition { navigation: auto; }
        ::view-transition { background-color: #F9F9FB; }

        ::view-transition-old(main-sidebar),
        ::view-transition-new(main-sidebar) {
            animation: none;
            mix-blend-mode: normal;
        }
        
        ::view-transition-old(main-header),
        ::view-transition-new(main-header) {
            animation: none;
            mix-blend-mode: normal;
        }

        ::view-transition-old(main-content) {
            animation: 0.25s ease-out both fade-out;
        }
        ::view-transition-new(main-content) {
            animation: 0.25s ease-in 0.1s both fade-in;
        }

        @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        ::view-transition-old(root),
        ::view-transition-new(root) {
            animation-duration: 0.4s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-active {
            background-color: #4c0519;
            color: white !important;
        }
        .card-shadow {
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.02);
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .brand-gradient {
            background: linear-gradient(135deg, #4c0519 0%, #9f1239 100%);
        }
        .chart-bar {
            transition: all 0.3s ease;
        }
        .chart-bar:hover {
            filter: brightness(1.2);
            transform: scaleY(1.02);
        }
    </style>
</head>
<body>
    <div id="root-container" class="min-h-screen flex flex-col lg:flex-row bg-[#F9F9FB]">
        
        <!-- Login View Container -->
        <div id="login-view-container" class="w-full flex flex-col lg:flex-row min-h-screen">
            <div class="hidden lg:flex lg:w-1/2 brand-gradient p-16 flex-col justify-between relative overflow-hidden">
                <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div class="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-rose-400/10 rounded-full blur-2xl"></div>
                
                <div class="relative z-10">
                    <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/c5fd2355-4020-4f4d-91fe-4462ed78a0b2/1768760218830-ded09594/logo-horizontal-colored.png" 
                         alt="Inventory Pro" id="login-brand-logo" class="h-12 brightness-0 invert opacity-95">
                </div>

                <div class="relative z-10 space-y-8 max-w-lg">
                    <h1 class="text-5xl font-bold text-white leading-tight">
                        Managing your <span class="text-rose-300">stock</span> has never been this <span class="text-rose-300">effortless</span>.
                    </h1>
                    <p class="text-rose-50/80 text-xl font-light">
                        A unified platform for multi-store visibility, precision tracking, and intelligent supply chain orchestration.
                    </p>
                </div>

                <div class="relative z-10 text-rose-100/50 text-sm flex items-center gap-4">
                    <span>&copy; 2024 Inventory Pro</span>
                    <span class="w-1 h-1 bg-rose-100/30 rounded-full"></span>
                    <a href="#" id="login-privacy-link" class="hover:text-white transition-colors">Privacy Policy</a>
                </div>
            </div>

            <div class="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
                <div class="w-full max-w-md">
                    <header class="mb-10">
                        <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                        <p class="text-slate-500 mt-2">Securely access your inventory dashboard.</p>
                    </header>

                    <div id="auth-container">
                        <form id="login-form" action="#" class="space-y-6" onsubmit="handleLogin(event)">
                            <div class="space-y-2">
                                <label for="email" class="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <iconify-icon icon="lucide:mail" class="text-slate-400 text-lg"></iconify-icon>
                                    </span>
                                    <input id="email" type="email" placeholder="name@company.com" class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 text-slate-900 placeholder:text-slate-400">
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="flex justify-between items-center ml-1">
                                    <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
                                    <a href="#" id="login-forgot-link" class="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">Forgot?</a>
                                </div>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <iconify-icon icon="lucide:lock" class="text-slate-400 text-lg"></iconify-icon>
                                    </span>
                                    <input id="password" type="password" placeholder="••••••••" class="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 text-slate-900 placeholder:text-slate-400">
                                </div>
                            </div>

                            <button type="submit" id="login-submit-btn" class="w-full py-4 bg-[#4c0519] text-white rounded-2xl font-bold shadow-lg shadow-rose-900/20 hover:bg-[#3d0414] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                                <span>Sign In to Dashboard</span>
                                <iconify-icon icon="lucide:arrow-right" class="text-lg group-hover:translate-x-1 transition-transform"></iconify-icon>
                            </button>
                        </form>

                        <div id="pending-approval-view" class="hidden text-center space-y-8 py-4">
                            <div class="flex justify-center">
                                <div class="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center relative">
                                    <div class="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-25"></div>
                                    <iconify-icon icon="lucide:shield-check" class="text-rose-600 text-5xl relative z-10"></iconify-icon>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <h3 class="text-2xl font-bold text-slate-900">Registration Received</h3>
                                <p class="text-slate-500 leading-relaxed">Your account has been created successfully. For security, please <b>wait for your administrator to approve you</b> before accessing the dashboard.</p>
                            </div>
                            <div class="pt-4 flex flex-col gap-3">
                                <button onclick="location.reload()" id="cta-retry-status-btn" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Check Status Now</button>
                            </div>
                        </div>
                    </div>

                    <div class="relative my-9">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                        <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-4 text-slate-400 tracking-widest font-bold">Authorized Login</span></div>
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <button id="google-login-btn" class="flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                            <iconify-icon icon="logos:google-icon" class="text-xl"></iconify-icon>
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentActiveView = 'overview';

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('login-submit-btn');
            
            btn.disabled = true;
            btn.innerHTML = '<iconify-icon icon="lucide:loader-2" class="animate-spin text-xl"></iconify-icon><span>Authenticating...</span>';
            
            setTimeout(() => {
                if (email === 'johdoe@gmail.com' && password === '1234') {
                    if (document.startViewTransition) {
                        document.startViewTransition(() => renderDashboard());
                    } else {
                        renderDashboard();
                    }
                } else {
                    document.getElementById('login-form').classList.add('hidden');
                    document.getElementById('pending-approval-view').classList.remove('hidden');
                }
            }, 800);
        }

        function switchView(viewName) {
            if (currentActiveView === viewName) return;
            currentActiveView = viewName;
            
            if (document.startViewTransition) {
                document.startViewTransition(() => updateMainContent());
            } else {
                updateMainContent();
            }
        }

        function updateMainContent() {
            const mainBody = document.getElementById('main-dashboard-body');
            const navLinks = document.querySelectorAll('nav a');
            
            // Update Nav Styles
            navLinks.forEach(link => {
                if (link.id === `nav-${currentActiveView}-link`) {
                    link.classList.add('sidebar-active');
                    link.classList.remove('text-slate-500');
                } else {
                    link.classList.remove('sidebar-active');
                    link.classList.add('text-slate-500');
                }
            });

            if (currentActiveView === 'overview') {
                mainBody.innerHTML = renderOverviewContent();
            } else if (currentActiveView === 'sales') {
                mainBody.innerHTML = renderSalesContent();
            }
        }

        function renderOverviewContent() {
            return `
                <div class="mb-10 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-slate-900">Store Operations Intelligence</h2>
                    <div class="flex gap-3">
                        <button id="new-transaction-btn-overview" class="px-5 py-2.5 bg-[#4c0519] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#3d0414] transition-all shadow-lg shadow-rose-900/10">
                            <iconify-icon icon="lucide:plus-circle"></iconify-icon>
                            New Store Transaction
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-6 mb-8">
                    <div class="col-span-12 lg:col-span-4 space-y-6">
                        <div class="bg-white p-7 rounded-[32px] card-shadow border border-slate-50">
                            <div class="flex items-center justify-between mb-6">
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Health</p>
                                <span class="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg">Alerts</span>
                            </div>
                            <div class="space-y-5">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                            <iconify-icon icon="lucide:package-minus" class="text-lg"></iconify-icon>
                                        </div>
                                        <span class="text-sm font-semibold text-slate-700">Low-Stock SKUs</span>
                                    </div>
                                    <span class="text-lg font-bold text-slate-900">18</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                            <iconify-icon icon="lucide:x-circle" class="text-lg"></iconify-icon>
                                        </div>
                                        <span class="text-sm font-semibold text-slate-700">Out of Stock</span>
                                    </div>
                                    <span class="text-lg font-bold text-slate-900">04</span>
                                </div>
                            </div>
                            <button id="replenishment-btn" class="w-full mt-6 py-3 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all">Generate Replenishment Plan</button>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-8 bg-white p-7 rounded-[32px] card-shadow border border-slate-50">
                        <div class="flex justify-between items-start mb-8">
                            <div>
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Pipeline</p>
                                <h3 class="text-2xl font-bold text-slate-900 mt-1">24 Pending Actions</h3>
                            </div>
                            <div class="flex gap-1">
                                <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div class="w-2 h-2 rounded-full bg-slate-200"></div>
                                <div class="w-2 h-2 rounded-full bg-slate-200"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-4 gap-4">
                            <div class="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-100 text-center">
                                <p class="text-2xl font-bold text-slate-900">08</p>
                                <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Pending</p>
                            </div>
                            <div class="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-100 text-center">
                                <p class="text-2xl font-bold text-slate-900">12</p>
                                <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Preparing</p>
                            </div>
                            <div class="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-100 text-center">
                                <p class="text-2xl font-bold text-slate-900">03</p>
                                <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Verified</p>
                            </div>
                            <div class="p-4 rounded-2xl bg-[#4c0519] text-white text-center">
                                <p class="text-2xl font-bold">01</p>
                                <p class="text-[10px] font-bold text-rose-200 uppercase mt-1">Urgent</p>
                            </div>
                        </div>
                        <div class="mt-8 flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <div class="flex items-center gap-3">
                                <iconify-icon icon="lucide:truck" class="text-rose-600 text-xl"></iconify-icon>
                                <div>
                                    <p class="text-xs font-bold text-slate-900">Transfer Delayed</p>
                                    <p class="text-[10px] text-slate-500">Inbound from HUB-002 • 45m past ETA</p>
                                </div>
                            </div>
                            <button id="track-transfer-btn" class="px-3 py-1.5 bg-white text-rose-600 text-[10px] font-bold rounded-lg shadow-sm border border-rose-100">Track</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderSalesContent() {
            return `
                <div class="mb-10 flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">Sales Management</h2>
                        <p class="text-sm text-slate-500">Manage invoices, direct sales, and payment reconciliation</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="cta-pos-sale" class="px-5 py-2.5 bg-[#4c0519] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#3d0414] transition-all shadow-lg shadow-rose-900/10">
                            <iconify-icon icon="lucide:shopping-cart"></iconify-icon>
                            Direct Sale (POS)
                        </button>
                        <button id="cta-new-invoice" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <iconify-icon icon="lucide:file-plus"></iconify-icon>
                            Create Invoice
                        </button>
                    </div>
                </div>

                <!-- Sales KPI Row -->
                <div class="grid grid-cols-12 gap-6 mb-8">
                    <div class="col-span-12 md:col-span-3">
                        <div class="bg-white p-6 rounded-[24px] card-shadow border border-slate-50">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Sales Today</p>
                            <h3 class="text-2xl font-bold text-slate-900">$12,840.00</h3>
                            <div class="mt-4 flex items-center gap-1.5 text-emerald-600">
                                <iconify-icon icon="lucide:trending-up" class="text-xs"></iconify-icon>
                                <span class="text-[10px] font-bold">+12.5% vs Yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <div class="bg-white p-6 rounded-[24px] card-shadow border border-slate-50">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Payments</p>
                            <h3 class="text-2xl font-bold text-slate-900">$4,120.50</h3>
                            <div class="mt-4 flex items-center gap-1.5 text-amber-600">
                                <iconify-icon icon="lucide:clock" class="text-xs"></iconify-icon>
                                <span class="text-[10px] font-bold">14 Invoices Overdue</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <div class="bg-white p-6 rounded-[24px] card-shadow border border-slate-50">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Order Value</p>
                            <h3 class="text-2xl font-bold text-slate-900">$428.15</h3>
                            <div class="mt-4 flex items-center gap-1.5 text-slate-500">
                                <iconify-icon icon="lucide:minus" class="text-xs"></iconify-icon>
                                <span class="text-[10px] font-bold">Stable this month</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <div class="bg-white p-6 rounded-[24px] card-shadow border border-slate-50 bg-[#4c0519] text-white">
                            <p class="text-[10px] font-bold text-rose-200/70 uppercase tracking-widest mb-1">Store Target</p>
                            <h3 class="text-2xl font-bold">84%</h3>
                            <div class="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full bg-rose-400 w-[84%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transactions Table -->
                <div class="bg-white rounded-[32px] card-shadow border border-slate-50 overflow-hidden">
                    <div class="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100">
                        <div>
                            <h4 class="text-lg font-bold text-slate-900">Recent Transactions</h4>
                            <p class="text-xs text-slate-400">Full history of store sales and invoice fulfillment</p>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2 bg-[#F9F9FB] border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">
                                <iconify-icon icon="lucide:filter"></iconify-icon>
                                All Status
                            </div>
                            <div class="flex items-center gap-2 bg-[#F9F9FB] border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">
                                <iconify-icon icon="lucide:calendar"></iconify-icon>
                                Last 30 Days
                            </div>
                            <div class="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                                <iconify-icon icon="lucide:download"></iconify-icon>
                                Export Report
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 border-b border-slate-100">
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400">Order ID</th>
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400">Customer</th>
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400">Products</th>
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">Method</th>
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Total</th>
                                    <th class="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr class="hover:bg-slate-50/30 transition-colors group">
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold text-slate-900">#INV-2024-0891</div>
                                        <div class="text-[10px] text-slate-400">Today, 02:45 PM</div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">JS</div>
                                            <div>
                                                <div class="text-xs font-bold">James Sterling</div>
                                                <div class="text-[10px] text-slate-400">Platinum Tier</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold">iPhone 15 Pro (x1)</div>
                                        <div class="text-[10px] text-slate-400">+ 2 other items</div>
                                    </td>
                                    <td class="px-8 py-5 text-center">
                                        <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                                            <iconify-icon icon="lucide:credit-card"></iconify-icon>
                                            CARD
                                        </div>
                                    </td>
                                    <td class="px-8 py-5 text-right font-bold text-slate-900 text-xs">$1,240.50</td>
                                    <td class="px-8 py-5 text-right">
                                        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">COMPLETED</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50/30 transition-colors group">
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold text-slate-900">#INV-2024-0890</div>
                                        <div class="text-[10px] text-slate-400">Today, 11:12 AM</div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">AL</div>
                                            <div>
                                                <div class="text-xs font-bold">Alice Liddell</div>
                                                <div class="text-[10px] text-slate-400">Standard</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold">Pro Display XDR</div>
                                        <div class="text-[10px] text-slate-400">SKU: AP-DS-XDR</div>
                                    </td>
                                    <td class="px-8 py-5 text-center">
                                        <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-rose-50 rounded-lg text-[10px] font-bold text-rose-600">
                                            <iconify-icon icon="lucide:banknote"></iconify-icon>
                                            CASH
                                        </div>
                                    </td>
                                    <td class="px-8 py-5 text-right font-bold text-slate-900 text-xs">$4,999.00</td>
                                    <td class="px-8 py-5 text-right">
                                        <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">PARTIAL</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50/30 transition-colors group">
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold text-slate-900">#INV-2024-0889</div>
                                        <div class="text-[10px] text-slate-400">Yesterday, 04:30 PM</div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">?</div>
                                            <div>
                                                <div class="text-xs font-bold italic">Walk-in Customer</div>
                                                <div class="text-[10px] text-slate-400">N/A</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="text-xs font-bold">USB-C Adapter (x4)</div>
                                        <div class="text-[10px] text-slate-400">SKU: AP-AC-UBC</div>
                                    </td>
                                    <td class="px-8 py-5 text-center">
                                        <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600">
                                            <iconify-icon icon="lucide:smartphone"></iconify-icon>
                                            MOBILE
                                        </div>
                                    </td>
                                    <td class="px-8 py-5 text-right font-bold text-slate-900 text-xs">$76.00</td>
                                    <td class="px-8 py-5 text-right">
                                        <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">FAILED</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="p-6 border-t border-slate-100 flex items-center justify-between">
                        <p class="text-xs text-slate-400 font-bold">Showing 1-10 of 2,450 results</p>
                        <div class="flex gap-2">
                            <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                <iconify-icon icon="lucide:chevron-left"></iconify-icon>
                            </button>
                            <button class="px-3 py-1 bg-[#4c0519] text-white rounded-lg text-xs font-bold">1</button>
                            <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold">2</button>
                            <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold">3</button>
                            <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderDashboard() {
            const root = document.getElementById('root-container');
            root.className = "min-h-screen bg-[#F9F9FB] flex overflow-hidden";
            root.innerHTML = `
                <!-- Sidebar -->
                <aside class="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen shrink-0 relative z-30" style="view-transition-name: main-sidebar">
                    <div class="p-8 flex-1">
                        <div class="flex items-center gap-3 mb-10">
                            <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/c5fd2355-4020-4f4d-91fe-4462ed78a0b2/1768760219299-c6f3eb4d/logo-icon.png" 
                                 class="h-10" alt="Icon">
                            <span class="text-xl font-bold tracking-tight text-[#4c0519]">Inventory Pro</span>
                        </div>

                        <div class="mb-8 relative group">
                            <button id="store-switcher-btn" class="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#4c0519]/20 transition-all text-left">
                                <div class="w-10 h-10 bg-[#4c0519] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/10">
                                    <iconify-icon icon="lucide:store" class="text-xl"></iconify-icon>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Store</p>
                                    <p class="text-sm font-bold text-slate-900 truncate">Manhattan East Hub</p>
                                </div>
                                <iconify-icon icon="lucide:chevrons-up-down" class="text-slate-400 text-sm"></iconify-icon>
                            </button>
                        </div>

                        <div class="space-y-8">
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management Menu</p>
                                <nav class="space-y-1">
                                    <a href="#" id="nav-overview-link" onclick="switchView('overview')" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold sidebar-active">
                                        <iconify-icon icon="lucide:layout-grid" class="text-xl"></iconify-icon>
                                        <span>Overview</span>
                                    </a>
                                    <a href="#" id="nav-sales-link" onclick="switchView('sales')" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:shopping-bag" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Sales</span>
                                    </a>
                                    <a href="https://p.superdesign.dev/draft/56199e9e-8950-4670-bf15-f3dcd9d7fd60" id="nav-transfers-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:truck" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Transfers Overview</span>
                                    </a>
                                    <a href="#" id="nav-analytics-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:bar-chart-3" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Analytics</span>
                                    </a>
                                </nav>
                            </div>

                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Inventory Logistics</p>
                                <nav class="space-y-1">
                                    <a href="https://p.superdesign.dev/draft/6f4ab3e4-e9cc-4d29-b5ae-25e6b1e29063" id="nav-transfer-list-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:list" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Transfer List</span>
                                    </a>
                                    <a href="https://p.superdesign.dev/draft/975641fe-ae3d-4689-b82c-721cf688f324" id="nav-create-transfer-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:plus-square" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Create Transfer</span>
                                    </a>
                                    <a href="https://p.superdesign.dev/draft/de542df0-a40f-418b-9354-f72f270f795b" id="nav-transfer-history-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:history" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Transfer History</span>
                                    </a>
                                    <a href="https://p.superdesign.dev/draft/e0b602e9-b61c-4427-95dd-729731d6ebe1" id="nav-transfer-details-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                        <iconify-icon icon="lucide:info" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                        <span>Transfer Details</span>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div class="p-6">
                        <button onclick="location.reload()" id="logout-btn" class="w-full flex items-center justify-center gap-2 py-4 text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-all font-bold group">
                            <iconify-icon icon="lucide:log-out" class="text-xl group-hover:-translate-x-1 transition-transform"></iconify-icon>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                <main class="flex-1 flex flex-col h-screen overflow-hidden">
                    <header class="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between shrink-0" style="view-transition-name: main-header">
                        <div class="flex flex-col">
                            <h1 class="text-lg font-bold text-slate-900 tracking-tight">Welcome, Aubrey Sabina!</h1>
                            <p class="text-xs text-slate-400">Managing Manhattan East Hub Hub with real-time accuracy</p>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="flex items-center bg-[#F9F9FB] rounded-full px-4 py-2 border border-slate-100 w-80">
                                <iconify-icon icon="lucide:search" class="text-slate-400 mr-2"></iconify-icon>
                                <input type="text" placeholder="Search store records..." class="bg-transparent outline-none text-sm w-full placeholder:text-slate-400">
                            </div>
                            
                            <div class="flex items-center gap-2 border-l border-slate-100 pl-4">
                                <button id="notifications-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative">
                                    <iconify-icon icon="lucide:bell" class="text-xl"></iconify-icon>
                                    <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                                </button>
                                <div class="ml-2 w-10 h-10 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white cursor-pointer">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aubrey" alt="Avatar">
                                </div>
                            </div>
                        </div>
                    </header>

                    <div id="main-dashboard-body" class="flex-1 overflow-y-auto p-10 scrollbar-hide" style="view-transition-name: main-content">
                        ${renderOverviewContent()}
                    </div>
                </main>
            `;
        }
    </script>
</body>
</html>
~~~

Generate the HTML for "Order Receipt".

- Preserve ALL persistent elements from source EXACTLY
- Only modify the dynamic content area (main-content)
- If source has NO persistent elements, focus on main-content transition only

Here is a reference implementation:

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Pro | Order Receipt</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <meta name="view-transition" content="same-origin">
    <!-- Prefetch for smooth navigation -->
    <link rel="prefetch" href="https://p.superdesign.dev/draft/b75e639b-910a-46c2-b13c-546b859acd56" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/4c808027-013b-400d-881a-2e4349ec0d52" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/4b47d1aa-640a-4260-8d59-283767b6b338" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/299796f0-7d8d-4722-8307-b531518cb3d0" as="document">
    <link rel="prefetch" href="https://p.superdesign.dev/draft/53396a66-ede8-4145-b4ea-1665c2d1d9f2" as="document">
    
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1a1a1a;
            margin: 0;
        }
        html {
            background-color: #F9F9FB;
        }
        @view-transition { navigation: auto; }
        ::view-transition { background-color: #F9F9FB; }

        ::view-transition-old(main-sidebar),
        ::view-transition-new(main-sidebar) {
            animation: none;
            mix-blend-mode: normal;
        }
        
        ::view-transition-old(main-header),
        ::view-transition-new(main-header) {
            animation: none;
            mix-blend-mode: normal;
        }

        ::view-transition-old(main-content) {
            animation: 0.25s ease-out both fade-out;
        }
        ::view-transition-new(main-content) {
            animation: 0.25s ease-in 0.1s both fade-in;
        }

        @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        .sidebar-active {
            background-color: #4c0519;
            color: white !important;
        }
        
        .card-shadow {
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.02);
        }

        .receipt-paper {
            background: white;
            position: relative;
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
        }

        .receipt-paper::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 10px;
            background: radial-gradient(circle, transparent, transparent 50%, white 50%, white);
            background-size: 20px 20px;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
    </style>
</head>
<body>
    <div id="root-container" class="min-h-screen bg-[#F9F9FB] flex overflow-hidden">
        
        <!-- Persistent Sidebar (Identical to Source) -->
        <aside class="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen shrink-0 relative z-30" style="view-transition-name: main-sidebar">
            <div class="p-8 flex-1">
                <div class="flex items-center gap-3 mb-10">
                    <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/c5fd2355-4020-4f4d-91fe-4462ed78a0b2/1768760219299-c6f3eb4d/logo-icon.png" 
                         class="h-10" alt="Inventory Pro Icon">
                    <span class="text-xl font-bold tracking-tight text-[#4c0519]">Inventory Pro</span>
                </div>

                <div class="mb-8 relative group">
                    <button id="store-switcher-btn" class="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#4c0519]/20 transition-all text-left">
                        <div class="w-10 h-10 bg-[#4c0519] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/10">
                            <iconify-icon icon="lucide:store" class="text-xl"></iconify-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Store</p>
                            <p class="text-sm font-bold text-slate-900 truncate">Manhattan East Hub</p>
                        </div>
                        <iconify-icon icon="lucide:chevrons-up-down" class="text-slate-400 text-sm"></iconify-icon>
                    </button>
                </div>

                <div class="space-y-8">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management Menu</p>
                        <nav class="space-y-1">
                            <a href="https://p.superdesign.dev/draft/b75e639b-910a-46c2-b13c-546b859acd56" id="nav-overview-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                <iconify-icon icon="lucide:layout-grid" class="text-xl"></iconify-icon>
                                <span>Overview</span>
                            </a>
                            <a href="https://p.superdesign.dev/draft/53396a66-ede8-4145-b4ea-1665c2d1d9f2" id="nav-sales-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold sidebar-active">
                                <iconify-icon icon="lucide:shopping-bag" class="text-xl"></iconify-icon>
                                <span>Sales (POS)</span>
                            </a>
                            <a href="#transfers" id="nav-transfers-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                <iconify-icon icon="lucide:truck" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                <span>Transfers</span>
                            </a>
                            <a href="#analytics" id="nav-analytics-link" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
                                <iconify-icon icon="lucide:bar-chart-3" class="text-xl group-hover:scale-110 transition-transform"></iconify-icon>
                                <span>Analytics</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <a href="#logout" id="logout-btn" class="w-full flex items-center justify-center gap-2 py-4 text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-all font-bold group">
                    <iconify-icon icon="lucide:log-out" class="text-xl group-hover:-translate-x-1 transition-transform"></iconify-icon>
                    <span>Sign Out</span>
                </a>
            </div>
        </aside>

        <main class="flex-1 flex flex-col h-screen overflow-hidden">
            <!-- Persistent Header (Identical to Source) -->
            <header class="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between shrink-0" style="view-transition-name: main-header">
                <div class="flex flex-col">
                    <h1 class="text-lg font-bold text-slate-900 tracking-tight">Transaction Completed</h1>
                    <p class="text-xs text-slate-400">Receipt generated for Order #ORD-2024-8842</p>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center bg-[#F9F9FB] rounded-full px-4 py-2 border border-slate-100 w-80">
                        <iconify-icon icon="lucide:search" class="text-slate-400 mr-2"></iconify-icon>
                        <input type="text" placeholder="Search orders..." class="bg-transparent outline-none text-sm w-full placeholder:text-slate-400">
                    </div>
                    
                    <div class="flex items-center gap-2 border-l border-slate-100 pl-4">
                        <button id="notifications-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative">
                            <iconify-icon icon="lucide:bell" class="text-xl"></iconify-icon>
                            <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        <div class="ml-2 w-10 h-10 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aubrey" alt="Aubrey Avatar">
                        </div>
                    </div>
                </div>
            </header>

            <!-- Dynamic Content Area -->
            <div id="main-dashboard-body" class="flex-1 overflow-y-auto p-10 scrollbar-hide flex flex-col items-center" style="view-transition-name: main-content">
                
                <div class="w-full max-w-4xl grid grid-cols-12 gap-10 items-start">
                    
                    <!-- Receipt Preview Section -->
                    <div class="col-span-12 lg:col-span-7 flex flex-col items-center">
                        <div class="receipt-paper w-full p-10 rounded-t-lg border-x border-t border-slate-100 mb-4">
                            <div class="flex justify-between items-start mb-12">
                                <div class="space-y-1">
                                    <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/c5fd2355-4020-4f4d-91fe-4462ed78a0b2/1768760218830-ded09594/logo-horizontal-colored.png" 
                                         alt="Logo" class="h-8">
                                    <p class="text-[10px] text-slate-400 font-medium">Manhattan East Hub • 142nd Ave, NY</p>
                                </div>
                                <div class="text-right">
                                    <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">Receipt</h4>
                                    <p class="text-sm font-bold text-slate-900">#ORD-2024-8842</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-dashed border-slate-200">
                                <div class="space-y-1">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Date & Time</p>
                                    <p class="text-xs font-semibold">May 24, 2024 • 03:22 PM</p>
                                </div>
                                <div class="space-y-1 text-right">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Cashier</p>
                                    <p class="text-xs font-semibold">Aubrey Sabina</p>
                                </div>
                                <div class="space-y-1">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Customer</p>
                                    <p class="text-xs font-semibold">James Sterling (Platinum)</p>
                                </div>
                                <div class="space-y-1 text-right">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Payment Method</p>
                                    <p class="text-xs font-semibold">Visa Card (**** 4242)</p>
                                </div>
                            </div>

                            <div class="space-y-6 mb-10">
                                <div class="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase mb-2">
                                    <div class="col-span-6">Description</div>
                                    <div class="col-span-2 text-center">Qty</div>
                                    <div class="col-span-4 text-right">Price</div>
                                </div>
                                
                                <div class="grid grid-cols-12 text-xs font-semibold text-slate-700">
                                    <div class="col-span-6">iPhone 15 Pro, 256GB - Blue Titanium</div>
                                    <div class="col-span-2 text-center">1</div>
                                    <div class="col-span-4 text-right">$1,099.00</div>
                                </div>
                                
                                <div class="grid grid-cols-12 text-xs font-semibold text-slate-700">
                                    <div class="col-span-6">Apple Watch Ultra 2, Ocean Band</div>
                                    <div class="col-span-2 text-center">1</div>
                                    <div class="col-span-4 text-right">$799.00</div>
                                </div>
                                
                                <div class="grid grid-cols-12 text-xs font-semibold text-slate-700">
                                    <div class="col-span-6">MagSafe Charger</div>
                                    <div class="col-span-2 text-center">2</div>
                                    <div class="col-span-4 text-right">$78.00</div>
                                </div>
                            </div>

                            <div class="pt-8 border-t border-slate-100">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs text-slate-500 font-medium">Subtotal</span>
                                    <span class="text-xs text-slate-900 font-semibold">$1,976.00</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs text-slate-500 font-medium">Tax (8.5%)</span>
                                    <span class="text-xs text-slate-900 font-semibold">$167.96</span>
                                </div>
                                <div class="flex justify-between items-center pt-4">
                                    <span class="text-lg font-bold text-slate-900">Total Amount Paid</span>
                                    <span class="text-2xl font-bold text-[#4c0519]">$2,143.96</span>
                                </div>
                            </div>

                            <div class="mt-12 pt-8 border-t border-dashed border-slate-200 text-center">
                                <div class="flex justify-center mb-4">
                                    <iconify-icon icon="mdi:barcode" class="text-6xl text-slate-800 opacity-80"></iconify-icon>
                                </div>
                                <p class="text-[10px] text-slate-400 font-medium">Thank you for shopping at Inventory Pro!<br>Return policy: 30 days with original receipt.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Controls Section -->
                    <div class="col-span-12 lg:col-span-5 space-y-6">
                        <div class="bg-[#4c0519] p-8 rounded-[32px] text-white shadow-xl shadow-rose-950/20">
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <iconify-icon icon="lucide:check-circle-2" class="text-3xl text-white"></iconify-icon>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold">Payment Successful</h3>
                                    <p class="text-rose-200/80 text-sm">Transaction completed instantly.</p>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                <button id="cta-print-receipt" class="w-full flex items-center justify-center gap-3 py-4 bg-white text-[#4c0519] rounded-2xl font-bold hover:bg-rose-50 transition-all active:scale-[0.98]">
                                    <iconify-icon icon="lucide:printer" class="text-xl"></iconify-icon>
                                    Print Receipt
                                </button>
                                <button id="cta-email-receipt" class="w-full flex items-center justify-center gap-3 py-4 bg-rose-800/50 text-white rounded-2xl font-bold hover:bg-rose-800 transition-all border border-rose-700/50">
                                    <iconify-icon icon="lucide:mail" class="text-xl"></iconify-icon>
                                    Email to Customer
                                </button>
                            </div>
                        </div>

                        <div class="bg-white p-8 rounded-[32px] card-shadow border border-slate-50">
                            <h4 class="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Additional Options</h4>
                            <div class="space-y-4">
                                <a href="#download-pdf" id="cta-download-pdf" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group">
                                    <div class="flex items-center gap-3">
                                        <iconify-icon icon="lucide:file-text" class="text-xl text-slate-400 group-hover:text-[#4c0519]"></iconify-icon>
                                        <span class="text-sm font-semibold text-slate-700">Download PDF Version</span>
                                    </div>
                                    <iconify-icon icon="lucide:chevron-right" class="text-slate-400"></iconify-icon>
                                </a>
                                <a href="#sms-receipt" id="cta-sms-receipt" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group">
                                    <div class="flex items-center gap-3">
                                        <iconify-icon icon="lucide:message-square" class="text-xl text-slate-400 group-hover:text-[#4c0519]"></iconify-icon>
                                        <span class="text-sm font-semibold text-slate-700">Send via SMS</span>
                                    </div>
                                    <iconify-icon icon="lucide:chevron-right" class="text-slate-400"></iconify-icon>
                                </a>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4 pt-4">
                            <a href="https://p.superdesign.dev/draft/4c808027-013b-400d-881a-2e4349ec0d52" id="cta-new-sale" class="w-full py-5 bg-slate-900 text-white text-center rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
                                Start New Transaction
                            </a>
                            <a href="https://p.superdesign.dev/draft/53396a66-ede8-4145-b4ea-1665c2d1d9f2" id="cta-back-dashboard" class="text-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                Back to POS Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
~~~
