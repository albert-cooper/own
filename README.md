# Game catalog

Next.js 14 / React 18 / Chakra UI game catalog, deployed to Cloudflare Workers with OpenNext.

## Local development

Use Node.js 20.x to reproduce the existing deployment environment.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. Keep private configuration out of Git.

## Checks and deployment

```sh
npm test
npm run build:worker
npx wrangler deploy
```

`build:pages` remains a compatibility alias for the same OpenNext build so existing Cloudflare settings keep working. It does not build for Pages. Workers Builds may continue using `npm run build:pages` and `npx wrangler deploy`. Keep `wrangler.toml`'s `name` aligned with the existing Worker. `BASE_URL` controls site text and URLs; it does not bind a custom domain.

## Code map

- `src/app/`: route pages and layouts; page content stays here.
- `src/config/site.ts`: domain normalization and default website identity.
- `src/config/advertising.ts`: shared ad-unit path, container IDs, estimated conversion value and timing.
- `src/services/catalog.ts`: game/category data access, locale dataset fallback and missing-record handling.
- `src/services/normalize-game.ts`: maps legacy `thumb` and `category` fields to the UI data model.
- `src/services/analytics.ts`: independent Meta/TikTok delivery guards and per-interaction deduplication.
- `src/components/ads/`: reusable GPT slot and two-slot page layout.
- `src/components/analytics/pixel-scripts.tsx`: Pixel initialization scripts, including existing IDs.
- `src/hooks/useAdClickTracking.ts`: iframe interaction lifecycle, timers and event cleanup.
- `src/utils/`: URL query merging, localization, non-mutating collection helpers and Meta Purchase helper.
- `data/`, `messages/`, `public/`: original content, translations and assets.
- `tests/`: regression checks using mocked browser APIs; tests never send live Pixel events.

The misspelled legacy component paths and `src/actions.ts` remain compatibility re-exports. New code should import the descriptive modules directly. `update_page_ads.js` now points to the shared ad components instead of rewriting page source by string replacement. `t.js` is a legacy data-generation utility; it is not run during builds and its source categories differ from the live JSON data. Do not run it as part of deployment.

## Tracking behavior

Both providers retain the `Purchase` event and configured 0.2 USD value. This is an estimated click-conversion value, not measured advertising revenue. Focus/visibility/unload signals are heuristics, not confirmation of an actual ad click. Only iframes within known ad containers qualify. Providers are deduplicated separately for an interaction, and missing/blocked SDKs do not throw into the UI. Timers and listeners are cleaned up when the tracker unmounts.

Pixel IDs are intentionally preserved, including the existing `Meta-Pixel-ID` initialization placeholder and the different numeric noscript ID. Supply the intended production IDs before expecting live events; this refactor does not choose or replace them. IDs shipped to browsers are public configuration, not secrets.

English and Japanese have catalog datasets. Other configured locale URLs fall back to the English catalog. French retains its existing translations; locales without translation files use English messages.

## Refactor behavior fixes

- Random sampling includes index zero, excludes out-of-bounds indices, and avoids duplicates.
- Grouping leaves the source dataset untouched.
- Search/channel query strings are encoded and merged without duplicate question marks.
- Unknown catalog categories/games return not-found responses.
- Related games exclude the current game by ID.
- Japanese records with legacy image/category fields are normalized without editing source JSON.
- Server-resolved site configuration is passed to the client footer.
- Equivalent GPT sizes no longer recreate a slot just because an array reference changed.

No automatic dependency upgrades, Git pushes or Cloudflare deployments are part of the refactor.
