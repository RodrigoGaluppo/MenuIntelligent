# THE CORK — seasonal visual menu

Visitor menu for THE CORK R32, based on the September 2026 menu and the supplied Google document.

## GitHub Pages

The included workflow builds and deploys the visitor menu to GitHub Pages whenever changes are pushed to `main` or `master`; it can also be started with **Actions → Deploy Cork to GitHub Pages → Run workflow**.

The Pages build uses Next.js static export, with the repository name as the URL base path so images, videos and the menu PDF load from a project Pages URL. GitHub Pages cannot run the app’s Node admin and API routes. The workflow omits those routes from its temporary build checkout; they remain available in the repository for local/server deployment.

Published visitor menu: [RodrigoGaluppo.github.io/MenuIntelligent](https://RodrigoGaluppo.github.io/MenuIntelligent/). The local admin still requires a Node server.

## Local setup

```bash
cd /home/russo/cork
npm ci
npm run dev
```

Public menu: http://localhost:3000  
Admin: http://localhost:3000/admin

Production commands for a regular Node server are `npm run build` and `npm start`.

## Menu and design

- White and turquoise palette with THE CORK wordmark in uppercase throughout the visitor experience.
- Menu cards show a still image and the dish name. Opening a card starts its video; the full-screen story shows ingredients and a quiet price and weight line.
- Expandable categories keep the menu uncluttered. Search opens matching categories automatically.
- Larger mobile icon controls, smooth section scrolling, and reduced-motion support.
- 23 dishes from the September 2026 menu with prices and weights.
- Beef tartare portions: 100 g / 72 PLN and 200 g / 86 PLN.
- Optional chicken, prawns and beef additions for Green Plate and porcini risotto.
- Polish, English and Ukrainian navigation, search, and accessible dish details.
- Preserved all 23 dish posters and eight finished videos. No video plays in the menu grid; vertical scrolling or swiping advances between dishes in the open category.
- Used the supplied document's restaurant interior and olive ritual images.
- The PDF does not list allergens, so the menu directs guests to staff rather than making up allergen details.
- Reflected VAT and the 10% charge for groups of six or more.
- Removed invented guest Wi-Fi credentials.

The menu is stored in `data/menu.json` and seeded by `src/lib/seed.ts`. On a Node server, the public menu reads the current saved store, so admin changes appear on the menu. On GitHub Pages, the data is a build-time snapshot because there is no server for admin changes to update.

## Sources

- [September 2026 menu](https://thecork.pl/wp-content/uploads/2026/09/Menu-09.2026.pdf), also saved to `public/menu-september-2026.pdf`.
- [Supplied Google document](https://docs.google.com/document/d/1jXTdiSLGzkvJH46dPxmXLfwQrt_mwvdCBDs5bqcwbvo/); all text and eight embedded images reviewed.
- [Restaurant website](https://thecork.pl/).

The dish photographs are illustrative generated assets inherited from the earlier project. Translations follow the Polish menu if the PDF translations differ. The restaurant site lists inconsistent Friday hours; the existing 17:00 time was retained.

## Verification

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass locally.
- The GitHub Pages static export was built separately with `GITHUB_PAGES_BASE=/MenuIntelligent` after excluding the Node-only admin and API routes, matching the workflow.
- Chromium checks at 390 px and 1440 px confirmed the mobile layout has no horizontal overflow, category expansion works, and search filters to a matching dish. A follow-up production-browser check confirmed cards show only a name with no video request, opening a card starts playback, and wheel scrolling and mobile swiping advance through dishes without visible arrow buttons.
- Server admin and external video generation are not deployed to Pages.

The menu UI follows [WCAG 2.2 target sizing guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) and [reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion). Video loading uses posters and click-to-play in line with [web.dev's video performance guidance](https://web.dev/learn/performance/video-performance).

## Video generation

The existing provider remains under `src/lib/video/`. It uses `XAI_API_KEY` when configured. Without it, the stub uses ffmpeg to make a still-poster loop; this is not a generated rotating video.
