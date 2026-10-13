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


## HTML 语义与搜索引擎设置

- 内容页共用 `src/components/page-shell.tsx`，提供 header/nav/main/footer；游戏列表使用 ul/li，卡片与详情使用 article。页面主标题为 h1，栏目和详情小节为 h2，栏目中的卡片标题为 h3。
- `src/lib/seo.ts` 统一生成标题、描述、canonical、hreflang 和分享元数据；站点来源仍由 `BASE_URL` / `src/config/site.ts` 决定。
- 首页、分类和详情的 canonical 去掉 channel、UTM 等参数，但访问链接中的参数继续传递，广告追踪行为保持原状。
- 只有 en-US、ja-JP 有游戏数据翻译。其他语言的游戏页 canonical 指向英文；仅有界面翻译不视作游戏内容翻译。hreflang 按实际存在的对应页面生成，不宣告缺失的译文。
- 关于、联系、隐私、条款正文目前都是英文：正文标记 lang=en-US，各语言副本 canonical 指向英文，sitemap 仅提交英文版本。
- 搜索页和游戏跳转页设为 noindex,follow，不加入 sitemap。robots.txt 不屏蔽这些页面或查询参数，让搜索引擎能读取页面的 canonical/noindex。
- `/sitemap.xml` 从实际目录数据生成，`/robots.txt` 提供地图地址。新增真正的语言翻译时，需要同步维护 catalogLocales、目录加载器和元数据文案。
- 部署后可在 Google Search Console 提交 `https://brutto-netto-rechner.com.de/sitemap.xml`。语义和 SEO 设置不替代原创内容，也不保证收录或排名。
