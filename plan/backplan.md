Ready for review
Select text to add comments on the plan
Plan: Fix Multi-Language & Data Flow Issues for Smooth Website Operation
Context
The library management system has backend infrastructure (models, controllers, migrations) already implemented, but critical issues prevent smooth operation:

Multi-language system incomplete: i18n infrastructure exists but isn't fully integrated
Public pages use mock data: Components ignore Inertia props and use hardcoded mock data
Navigation has hardcoded text: Violates project convention "All UI text should use translation keys"
Language switcher not integrated: TopBar has basic language dropdown but doesn't connect to i18n system
Backend-frontend language mismatch: Controllers hardcode Dari content extraction
This plan addresses all issues to make the website run smoothly with proper multi-language support and real data flow.

Current Status Assessment
✅ BACKEND INFRASTRUCTURE COMPLETE:

All models exist: Book, Category, Video, Audio, Article, Fatwa, Magazine
All migrations created and database tables exist
All controllers with CRUD operations implemented
Admin pages for all resources exist and work
Database seeders for permissions, roles, and categories exist
⚠️ CRITICAL ISSUES TO FIX:

Public pages ignore backend data: Using MOCK_BOOKS/MOCK_VIDEOS instead of Inertia props
i18n system not fully integrated: Navigation/components have hardcoded text
Language switcher disconnected: TopBar dropdown doesn't connect to i18n system
Backend hardcodes language: Controllers always extract ['da'] content
Missing translation keys: Navigation terms not in translation files
Phase 1: Fix Public Pages Data Flow
1.1 Books Page (resources/js/pages/library/index.tsx)
Problem: Uses MOCK_BOOKS instead of Inertia props Fix:

Add PageProps interface for books and categories
Accept props in function signature
Replace MOCK_BOOKS with props.books
Replace hardcoded CATEGORIES with props.categories
Update filtering logic to work with real data
Remove mock data arrays
1.2 Videos Page (resources/js/pages/library/videos.tsx)
Problem: Uses MOCK_VIDEOS instead of Inertia props Fix:

Add PageProps interface for videos and categories
Accept props in function signature
Replace MOCK_VIDEOS with props.videos
Replace hardcoded CATEGORIES with props.categories
Update filtering logic
Remove mock data arrays
1.3 Other Public Components
Check and fix similar issues in:

resources/js/components/home/audio-list.tsx
resources/js/components/home/dar-ul-ifta-list.tsx
resources/js/components/home/main-nav.tsx (category links)
Key Change Pattern:

// BEFORE (current):
export default function LibraryIndex() {
  const [search, setSearch] = useState('');
  // Uses MOCK_BOOKS, hardcoded CATEGORIES
  
// AFTER (fixed):
interface PageProps {
  books: Book[];
  categories: Array<{slug: string, name: string}>;
}

export default function LibraryIndex({ books, categories }: PageProps) {
  const [search, setSearch] = useState('');
  // Uses books from props, categories from props
Phase 2: Complete i18n Integration
2.1 Navigation Components
A. Main Navigation (resources/js/components/home/main-nav.tsx)

Replace hardcoded NAV_ITEMS labels with translation keys
Add useTranslation() hook
Update to use t('nav.home'), t('nav.library'), etc.
B. TopBar (resources/js/components/home/top-bar.tsx)

Remove hardcoded language labels
Integrate LanguageSwitcher component instead of custom dropdown
Add dynamic date formatting based on locale
C. App Sidebar (resources/js/components/app-sidebar.tsx)

Fix content management section (lines 49-68)
Replace hardcoded کتاب‌ها, ویدیوها, etc. with t('sidebar.books'), t('sidebar.videos')
D. Home Footer (resources/js/components/home/home-footer.tsx)

Replace all hardcoded Persian text with translation keys
Add useTranslation() hook
Use t('footer.about'), t('footer.sitemap'), etc.
2.2 Update Translation Files
Add missing keys to both da/translation.json and en/translation.json:

{
  "nav": {
    "home": "خانه",
    "library": "کتابخانه",
    "darUlIfta": "دارالإفتاء",
    "videos": "ویدیوها",
    "audio": "صوتی‌ها",
    "statements": "بیانیه‌ها",
    "magazine": "مجله",
    "about": "درباره ما",
    "contact": "تماس با ما"
  },
  "footer": {
    "about": "درباره ما",
    "sitemap": "نقشه سایت",
    "recentBooks": "کتاب‌های اخیر",
    "recentArticles": "مقاله‌های اخیر",
    "copyright": "کلیه حقوق این سایت محفوظ است",
    "home": "خانه",
    "faq": "سوالات متداول",
    "support": "پشتیبانی"
  },
  "sidebar": {
    "books": "کتاب‌ها",
    "videos": "ویدیوها",
    "audios": "صوتی‌ها",
    "fatwas": "فتواها",
    "articles": "مقاله‌ها",
    "magazines": "مجلات",
    "contentManagement": "مدیریت محتوا"
  },
  "lang": {
    "dari": "دری",
    "english": "English",
    "arabic": "العربية"
  }
}
Phase 3: Language Switcher Integration
3.1 Replace TopBar Language Dropdown
Remove current language dropdown implementation (lines 25-53 in top-bar.tsx)
Import and use LanguageSwitcher component
Place in appropriate location in TopBar
3.2 Add Language Switcher to Admin Area
Consider adding language switcher to admin header for consistency
Or ensure admin pages inherit language from public area
3.3 Language Detection & Persistence
Enhance LanguageSwitcher to detect browser language on first visit
Consider adding language preference to user profile (future enhancement)
Phase 4: Backend Language Handling
4.1 Create Language Middleware
File: app/Http/Middleware/SetLocale.php Purpose: Detect and set application locale based on:

Session/cookie preference
Accept-Language header
Default to 'da' (Dari)
Implementation:

public function handle(Request $request, Closure $next)
{
    $locale = $request->session()->get('locale') 
               ?? $request->cookie('locale')
               ?? $request->getPreferredLanguage(['da', 'en'])
               ?? 'da';
    
    app()->setLocale($locale);
    return $next($request);
}
4.2 Update Controllers for Dynamic Language
Current Issue: Controllers hardcode ['da'] for content extraction Fix: Update all public controller methods to use current locale:

In BookController.php, VideoController.php, etc.:

// BEFORE:
'title' => $b->title['da'] ?? '',
'description' => $b->description['da'] ?? '',

// AFTER:
'title' => $b->title[app()->getLocale()] ?? $b->title['da'] ?? '',
'description' => $b->description[app()->getLocale()] ?? $b->description['da'] ?? '',
4.3 Share Locale with Inertia
Add locale to Inertia shared data in app/Http/Middleware/HandleInertiaRequests.php:

'shared' => [
    'locale' => fn () => app()->getLocale(),
    'locales' => ['da', 'en'],
],
Phase 5: Database Content Seeding
5.1 Add Sample Data
Create seeders for sample books, videos, and other content:

database/seeders/BookSeeder.php
database/seeders/VideoSeeder.php
database/seeders/AudioSeeder.php
etc.
Important: Seed data should include both Dari (da) and English (en) translations for all translatable fields.

5.2 Update DatabaseSeeder
Add new seeders to DatabaseSeeder.php:

$this->call([
    PermissionSeeder::class,
    RoleSeeder::class,
    CategorySeeder::class,
    BookSeeder::class,
    VideoSeeder::class,
    AudioSeeder::class,
    FatwaSeeder::class,
    ArticleSeeder::class,
    MagazineSeeder::class,
]);
Phase 6: Testing and Validation
6.1 Functional Testing
Language Switching: Test Dari ↔ English switching on all pages
Data Flow: Verify public pages show real database content
Navigation: Ensure all translated navigation works correctly
RTL/LTR: Test direction switching for Dari (RTL) vs English (LTR)
6.2 Technical Validation
TypeScript: Run npm run types:check - fix any errors
Linting: Run npm run lint:check - ensure code quality
Build: Run npm run build - verify production build works
Database: Run php artisan migrate:fresh --seed - test fresh installation
6.3 Cross-Browser Testing
Test RTL layout in Dari mode
Test LTR layout in English mode
Verify language switcher persists across page reloads
Implementation Order (Priority-Based)
Step	Task	Priority	Estimated Time
1	Fix Books page data flow	🔴 HIGH	1 hour
2	Fix Videos page data flow	🔴 HIGH	1 hour
3	Update translation files with missing keys	🔴 HIGH	30 mins
4	Fix Main Navigation i18n	🟠 MEDIUM	1 hour
5	Fix Home Footer i18n	🟠 MEDIUM	1 hour
6	Integrate LanguageSwitcher into TopBar	🟠 MEDIUM	45 mins
7	Fix App Sidebar i18n	🟠 MEDIUM	30 mins
8	Create Language Middleware	🟡 LOW	1 hour
9	Update controllers for dynamic language	🟡 LOW	1 hour
10	Add sample data seeders	🟢 OPTIONAL	2 hours
11	Test and validate everything	🔴 HIGH	1 hour
Total Estimated Time: ~10 hours

Critical Files to Modify
Frontend (React):
resources/js/pages/library/index.tsx - Books page props
resources/js/pages/library/videos.tsx - Videos page props
resources/js/components/home/main-nav.tsx - Navigation i18n
resources/js/components/home/top-bar.tsx - Language switcher
resources/js/components/home/home-footer.tsx - Footer i18n
resources/js/components/app-sidebar.tsx - Sidebar i18n
Backend (PHP):
app/Http/Controllers/BookController.php - Dynamic locale
app/Http/Controllers/VideoController.php - Dynamic locale
app/Http/Controllers/AudioController.php - Dynamic locale
app/Http/Controllers/FatwaController.php - Dynamic locale
app/Http/Controllers/ArticleController.php - Dynamic locale
app/Http/Controllers/MagazineController.php - Dynamic locale
app/Http/Middleware/SetLocale.php - New middleware
app/Http/Middleware/HandleInertiaRequests.php - Share locale
Translation Files:
resources/js/i18n/locales/da/translation.json - Add missing keys
resources/js/i18n/locales/en/translation.json - Add missing keys
Database:
database/seeders/BookSeeder.php - Sample data (optional)
database/seeders/VideoSeeder.php - Sample data (optional)
Success Metrics
✅ Website runs smoothly when:

All public pages show real database content (no mock data)
Language switching works instantly across entire site
Navigation and UI text change with language selection
Database content displays in selected language
RTL/LTR layout switches correctly for Dari/English
No TypeScript or linting errors
Production build succeeds without errors
🚨 Red Flags to Watch:

Components still using mock/hardcoded data
Translation keys missing (shows key instead of text)
Language switcher not affecting content
RTL/LTR layout issues
TypeScript errors after changes
Rollback Plan
If issues arise:

Frontend issues: Revert component changes one by one
Backend issues: Comment out middleware and revert controller changes
Database issues: Run php artisan migrate:rollback if migrations added
Translation issues: Restore backup of translation JSON files
All changes should be committed frequently with descriptive messages to enable easy rollback.