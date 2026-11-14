# Graph Report - Foursix  (2026-11-13)

## Corpus Check
- 197 files · ~85,624 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .nix 1, .webmanifest 1)

## Summary
- 1034 nodes · 3142 edges · 71 communities (41 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.82)
- Token cost: 288,253 input · 0 output

## Community Hubs (Navigation)
- Server Pages & Firebase Data
- FireCMS Admin Schemas
- UI Card & Avatar Primitives
- Root Layout & SEO Helpers
- Home Page Sections
- Sidebar UI Components
- App Blueprint & Design Notes
- Core Dependencies
- Legal & FAQ Pages
- Genkit AI Flows
- Package Manifest
- Sitemap, Robots & llms.txt
- Detail Page Clients
- Form Components
- Dev Dependencies
- Contact Page & Inputs
- TypeScript Config
- shadcn Components Config
- Leadership & Venture Clients
- Menubar UI
- Subscribe & Ventures Listing
- Blog Listing Client
- Trademark Detail Client
- Carousel UI
- Blog & News Article Clients
- Alert Dialog UI
- Trademark Seed Data
- Chart UI
- Sheet UI
- Hero Particle Canvas
- Table UI
- NPM Scripts
- Careers Client & Accordion
- Logo Brand Elements
- Global Page Client
- Next Config
- Android Icon 512 Logo
- Apple Touch Icon Logo
- Alert UI
- Contact Email API
- Android Icon 192 Logo
- Magazine Static Data
- IDX Workspace Icon
- App Hosting Config
- Collapsible UI
- PostCSS Config
- Admin Layout
- Media Proxy Route
- FAQ Static Data
- Placeholder Images
- clsx Package
- date-fns Package
- dompurify Package
- @genkit-ai/google-genai Package
- @hookform/resolvers Package
- isomorphic-dompurify Package
- lenis Package
- @mui/material Package
- @mui/x-date-pickers Package
- @radix-ui/react-alert-dialog Package
- @radix-ui/react-popover Package
- @radix-ui/react-select Package
- @radix-ui/react-separator Package
- @radix-ui/react-tooltip Package
- react-day-picker Package
- react-dom Package
- react-router-dom Package
- recharts Package
- @tailwindcss/typography Package
- Favicon 16 Logo
- Favicon 32 Logo

## God Nodes (most connected - your core abstractions)
1. `cn()` - 193 edges
2. `react` - 72 edges
3. `getCachedRoleSync()` - 71 edges
4. `next` - 69 edges
5. `getFirebaseImageUrl()` - 69 edges
6. `Navbar()` - 61 edges
7. `Footer()` - 59 edges
8. `JsonLd()` - 56 edges
9. `webPageNode()` - 56 edges
10. `buildMetadata()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Public site verification key file (acd8240348f158c75896363b44b48270)` --conceptually_related_to--> `Build and Deploy to Firebase Hosting (npm run build, firebase deploy --only hosting)`  [AMBIGUOUS]
  public/acd8240348f158c75896363b44b48270.txt → notes.txt
- `nodemailer (+ @types/nodemailer)` --conceptually_related_to--> `Multi-Step Contact Form (Magnetic Submit Button)`  [INFERRED]
  notes.txt → docs/blueprint.md
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogTitle` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **FourSix46 Core Landing Page Features** — docs_blueprint_hero_section_kinetic_typography, docs_blueprint_ventures_portfolio_bento_grid, docs_blueprint_vision_timeline, docs_blueprint_magazines_editorial_layout, docs_blueprint_interactive_3d_globe, docs_blueprint_multi_step_contact_form, docs_blueprint_ventures_ticker_auto_suggested_logos [EXTRACTED 1.00]
- **Motion and Scroll Animation System** — docs_blueprint_lenis_smooth_scrolling, docs_blueprint_framer_motion, docs_blueprint_60fps_animation_target [INFERRED 0.85]
- **FireCMS v2 Pinned Dependency Stack under React 19** — notes_firecms_v2, notes_material_ui_v5, notes_date_fns_v2, notes_nextjs_15_react_19, notes_legacy_peer_deps_flag [EXTRACTED 1.00]
- **FourSix Logo Composition** — public_apple_touch_icon_foursix_wordmark, public_apple_touch_icon_46_numeral_mark, public_apple_touch_icon_armadillo_mascot [INFERRED 0.85]
- **FourSix Logo Composition** — public_logo_foursix_wordmark, public_logo_yellow_swoosh, public_logo_numeral_46, public_logo_animal_mascot [EXTRACTED 1.00]

## Communities (71 total, 30 thin omitted)

### Community 0 - "Server Pages & Firebase Data"
Cohesion: 0.06
Nodes (118): firebase, AboutPageServer(), generateMetadata(), revalidate, BlogPageServer(), generateMetadata(), revalidate, BlogDetailPageServer() (+110 more)

### Community 1 - "FireCMS Admin Schemas"
Cohesion: 0.08
Nodes (54): firecms, ensureSingleton(), aboutPageCollection, adminUsersCollection, auditLogCollection, blogAuthorsCollection, blogCategoriesCollection, blogPostsCollection (+46 more)

### Community 2 - "UI Card & Avatar Primitives"
Cohesion: 0.07
Nodes (37): Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardDescription, CardFooter, CardHeader (+29 more)

### Community 3 - "Root Layout & SEO Helpers"
Cohesion: 0.07
Nodes (39): inter, manrope, metadata, RootLayout(), sourceCodePro, ScrollReset(), SmoothScroll(), ScrollToTop() (+31 more)

### Community 4 - "Home Page Sections"
Cohesion: 0.12
Nodes (28): framer-motion, react, HomeClient(), Preloader(), PreloaderProps, words, AccordionItem(), FAQ (+20 more)

### Community 5 - "Sidebar UI Components"
Cohesion: 0.07
Nodes (28): Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel (+20 more)

### Community 6 - "App Blueprint & Design Notes"
Cohesion: 0.08
Nodes (29): App Blueprint, FourSix46: House of Multibrands, Framer Motion (Page Transitions and Hover Effects), Hero Section with Kinetic Typography, Interactive 3D Globe, Lenis Smooth Scrolling (@studio-freight/react-lenis), Magazines Editorial Layout (Parallax), Multi-Step Contact Form (Magnetic Submit Button) (+21 more)

### Community 7 - "Core Dependencies"
Cohesion: 0.06
Nodes (32): dependencies, firebase@^12.10.0, firecms@^2.2.1, framer-motion@^11.11.11, lucide-react@^0.475.0, @mui/icons-material@^5.18.0, next@15.5.9, @radix-ui/react-accordion@^1.2.3 (+24 more)

### Community 8 - "Legal & FAQ Pages"
Cohesion: 0.14
Nodes (23): react-markdown, CookiesClient(), AccordionItem(), FAQ, FAQClient(), metadata, NotFound(), suggestions (+15 more)

### Community 9 - "Genkit AI Flows"
Cohesion: 0.10
Nodes (24): dotenv@^16.5.0, dotenv, generateVentureLogoAndTagline(), generateVentureLogoAndTaglineFlow, GenerateVentureLogoAndTaglineInput, GenerateVentureLogoAndTaglineInputSchema, GenerateVentureLogoAndTaglineOutput, GenerateVentureLogoAndTaglineOutputSchema (+16 more)

### Community 10 - "Package Manifest"
Cohesion: 0.07
Nodes (27): cobe@^0.6.3, @date-io/date-fns@^2.17.0, embla-carousel-react@^8.6.0, @emotion/react@^11.14.0, @emotion/styled@^11.14.1, @mui/lab@^7.0.1-beta.23, @radix-ui/react-progress@^1.1.2, @radix-ui/react-radio-group@^1.2.3 (+19 more)

### Community 11 - "Sitemap, Robots & llms.txt"
Cohesion: 0.10
Nodes (23): dynamic, GET(), AI_CRAWLERS, dynamic, sitemap(), COMPANIES_HOUSE_URL, COMPANY_NUMBER, EXCLUDED_PATHS (+15 more)

### Community 12 - "Detail Page Clients"
Cohesion: 0.21
Nodes (17): GalleryClient(), GalleryItem, RegionalClient(), formatExternalUrl(), ProfileClient(), MagazineViewerClient(), Page, PageProps (+9 more)

### Community 13 - "Form Components"
Cohesion: 0.12
Nodes (20): class-variance-authority@^0.7.1, @radix-ui/react-label@^2.1.2, @radix-ui/react-slot@^1.2.3, react-hook-form@^7.54.2, class-variance-authority, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form (+12 more)

### Community 14 - "Dev Dependencies"
Cohesion: 0.10
Nodes (19): devDependencies, genkit-cli@^1.28.0, postcss@^8, tailwindcss@^3.4.1, @types/dompurify@^3.0.5, @types/node@^20, @types/nodemailer@^7.0.11, @types/react@^19.2.1 (+11 more)

### Community 15 - "Contact Page & Inputs"
Cohesion: 0.19
Nodes (13): ContactClient(), defaultHubs, Contact(), Input, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton (+5 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 17 - "shadcn Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 18 - "Leadership & Venture Clients"
Cohesion: 0.17
Nodes (12): LeadershipClient(), formatExternalUrl(), getIcon(), VentureClient(), About(), AboutProps, fallbackTimelineData, TimelineItem (+4 more)

### Community 19 - "Menubar UI"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 20 - "Subscribe & Ventures Listing"
Cohesion: 0.22
Nodes (11): lucide-react, next, metadata, SubscribePage(), SubscribeClient(), VenturesClient(), NewsArticle, NewsroomProps (+3 more)

### Community 21 - "Blog Listing Client"
Cohesion: 0.23
Nodes (12): BlogCategory, BlogClient(), BlogPost, CategoryPill(), estimateReadingTime(), FeaturedCard(), formatDate(), NewsletterBand() (+4 more)

### Community 22 - "Trademark Detail Client"
Cohesion: 0.22
Nodes (14): AccordionItem(), applicationNumberDisplay(), BASE_STAGES, buildTimeline(), DEVICE_LIKE_TYPES, EXCEPTION_STATUSES, findStageIndex(), formatDate() (+6 more)

### Community 23 - "Carousel UI"
Cohesion: 0.19
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 24 - "Blog & News Article Clients"
Cohesion: 0.28
Nodes (9): BlogDetailClient(), formatDate(), toDate(), ArticleClient(), formatExternalUrl(), FaqAccordion(), FaqItem, FaqInput (+1 more)

### Community 25 - "Alert Dialog UI"
Cohesion: 0.21
Nodes (11): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+3 more)

### Community 26 - "Trademark Seed Data"
Cohesion: 0.29
Nodes (10): ensureTrademarkData(), isEmpty(), seedReferenceCollection(), SeedResult, stripUndefined(), JURISDICTION_SEED, PROPRIETOR_SEED, TRADEMARK_PAGE_SETTINGS_SEED (+2 more)

### Community 27 - "Chart UI"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 28 - "Sheet UI"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 29 - "Hero Particle Canvas"
Cohesion: 0.31
Nodes (8): AntiGravityCanvas(), BackgroundParticle, Hero(), HeroContent(), HeroDataProps, MouseState, Particle, randomRange()

### Community 30 - "Table UI"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 31 - "NPM Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, genkit:dev, genkit:watch, lint, start, typecheck

### Community 32 - "Careers Client & Accordion"
Cohesion: 0.46
Nodes (5): CareersClient(), JobPosting, AccordionContent, AccordionItem, AccordionTrigger

### Community 33 - "Logo Brand Elements"
Cohesion: 0.38
Nodes (7): Curled Banded Animal Mascot forming the digit 6, Logo Color Palette (red, sky blue, yellow on white), FourSix Brand (registered trademark), FourSix Logo (brand mark image), Red 'FourSix' Wordmark with registered symbol, Blue '46' Numeral Mark (striped 4, animal-shaped 6), Yellow Wave Swoosh Underline

### Community 34 - "Global Page Client"
Cohesion: 0.43
Nodes (5): GlobalClient(), Status, Badge(), BadgeProps, badgeVariants

### Community 36 - "Android Icon 512 Logo"
Cohesion: 0.50
Nodes (5): Blue 46 Numeral Mark, FourSix Brand, FourSix Android Chrome App Icon (512x512), FourSix Registered Wordmark (red text with yellow wave underline), Striped Animal Mascot Forming the Digit 6

### Community 37 - "Apple Touch Icon Logo"
Cohesion: 0.50
Nodes (5): Apple Touch Icon (FourSix logo, home-screen icon), '46' Numeral Mark (light blue, striped digits), Armadillo Mascot (curled animal forming the digit 6), FourSix Brand Identity, FourSix Wordmark (red 'Four', blue 'Six', registered mark, yellow swoosh)

### Community 38 - "Alert UI"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 40 - "Android Icon 192 Logo"
Cohesion: 0.50
Nodes (4): Android Chrome Icon 192x192 (FourSix logo app icon), Armadillo-like Mascot Curled Inside the Numeral 6, FourSix Brand Logo (red-orange wordmark with registered mark above large blue numeral 46), PWA / Android Home Screen App Icon

### Community 41 - "Magazine Static Data"
Cohesion: 0.50
Nodes (3): BodyContentBlock, magazineData, MagazineIssue

### Community 42 - "IDX Workspace Icon"
Cohesion: 0.67
Nodes (3): IDX Workspace Icon (2x2 grid of rounded squares, orange-to-magenta gradient), App Grid Motif (four outlined squares in a rounded-square frame), Project IDX / Firebase Studio Workspace Configuration

## Ambiguous Edges - Review These
- `Build and Deploy to Firebase Hosting (npm run build, firebase deploy --only hosting)` → `Public site verification key file (acd8240348f158c75896363b44b48270)`  [AMBIGUOUS]
  public/acd8240348f158c75896363b44b48270.txt · relation: conceptually_related_to

## Knowledge Gaps
- **20 isolated node(s):** `Entry point src/app/page.tsx`, `Interactive 3D Globe`, `Typography (Inter, Source Code Pro)`, `react-router-dom`, `Environment file env.local` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Home Page Sections` to `FireCMS Admin Schemas`, `UI Card & Avatar Primitives`, `Root Layout & SEO Helpers`, `Sidebar UI Components`, `Core Dependencies`, `Legal & FAQ Pages`, `Package Manifest`, `Detail Page Clients`, `Form Components`, `Contact Page & Inputs`, `Leadership & Venture Clients`, `Menubar UI`, `Subscribe & Ventures Listing`, `Blog Listing Client`, `Trademark Detail Client`, `Carousel UI`, `Blog & News Article Clients`, `Alert Dialog UI`, `Chart UI`, `Sheet UI`, `Hero Particle Canvas`, `Table UI`, `Careers Client & Accordion`, `Global Page Client`, `Alert UI`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **What connects `Entry point src/app/page.tsx`, `Interactive 3D Globe`, `Typography (Inter, Source Code Pro)` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server Pages & Firebase Data` be split into smaller, more focused modules?**
  _Cohesion score 0.06082318286760608 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `UI Card & Avatar Primitives` to `Careers Client & Accordion`, `Global Page Client`, `Root Layout & SEO Helpers`, `Home Page Sections`, `Sidebar UI Components`, `Alert UI`, `Legal & FAQ Pages`, `Detail Page Clients`, `Form Components`, `Contact Page & Inputs`, `Menubar UI`, `Subscribe & Ventures Listing`, `Trademark Detail Client`, `Carousel UI`, `Alert Dialog UI`, `Chart UI`, `Sheet UI`, `Table UI`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `FireCMS Admin Schemas` be split into smaller, more focused modules?**
  _Cohesion score 0.07938686799359414 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Subscribe & Ventures Listing` to `Server Pages & Firebase Data`, `Global Page Client`, `Root Layout & SEO Helpers`, `Home Page Sections`, `Contact Email API`, `Core Dependencies`, `Legal & FAQ Pages`, `Package Manifest`, `Sitemap, Robots & llms.txt`, `Detail Page Clients`, `Admin Layout`, `Leadership & Venture Clients`, `Blog Listing Client`, `Trademark Detail Client`, `Blog & News Article Clients`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Build and Deploy to Firebase Hosting (npm run build, firebase deploy --only hosting)` and `Public site verification key file (acd8240348f158c75896363b44b48270)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._