# THE CORK — seasonal visual menu

Visitor menu for THE CORK in Wrocław, based on the September 2026 menu and the supplied Google document.

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

- Cork's turquoise palette has warm light surfaces and a restaurant-black dark mode with restrained green details. The theme follows the device by default and a guest override is saved locally.
- The restaurant's official wordmark sits beside a small "powered by plately" app credit. Dish rows use small round images, with softer italic ingredients and a View more action revealed only after opening a dish.
- Expandable categories and dish rows keep the menu uncluttered. Search opens matching categories automatically.
- The story viewer uses native vertical scroll snapping for wheel, trackpad, touch, and keyboard input. End slides wrap to the start. A video loads, starts muted, and loops automatically only on the active dish; dishes without video show a still image. Reduced-motion preferences stop automatic playback and shorten transitions.
- 23 dishes from the September 2026 menu with prices and weights.
- Beef tartare portions: 100 g / 72 PLN and 200 g / 86 PLN.
- Optional chicken, prawns and beef additions for Green Plate and porcini risotto.
- Polish, English and Ukrainian navigation, search, and accessible dish details.
- Preserved all 23 dish posters and eight finished videos. No video plays in the menu list; vertical scrolling or swiping advances through all visible dishes.
- Used the supplied document's restaurant interior and olive ritual images.
- The published PDF does not include a dish-by-dish allergen chart. The allergen panel labels EU allergen categories identifiable from named ingredients and directs guests to staff for the complete recipe, sauces, and cross-contact. A kitchen-approved chart is needed before presenting a complete or definitive list.
- Reflected VAT and the 10% charge for groups of six or more.
- Removed invented guest Wi-Fi credentials.

The menu is stored in `data/menu.json` and seeded by `src/lib/seed.ts`. On a Node server, the public menu reads the current saved store, so admin changes appear on the menu. On GitHub Pages, the data is a build-time snapshot because there is no server for admin changes to update.

## Sources

- [September 2026 menu](https://thecork.pl/wp-content/uploads/2026/09/Menu-09.2026.pdf), also saved to `public/menu-september-2026.pdf`.
- [Supplied Google document](https://docs.google.com/document/d/1jXTdiSLGzkvJH46dPxmXLfwQrt_mwvdCBDs5bqcwbvo/); all text and eight embedded images reviewed.
- [Restaurant website](https://thecork.pl/).
- [Official teal wordmark](https://thecork.pl/wp-content/uploads/2025/09/the_cork_png_04-1.png) and [white wordmark](https://thecork.pl/wp-content/uploads/2025/09/the_cork_png_white_04.png).
- [EU allergen categories, Regulation 1169/2011 Annex II](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/eng).

The dish photographs are illustrative generated assets inherited from the earlier project. Translations follow the Polish menu if the PDF translations differ. The restaurant site lists inconsistent Friday hours; the existing 17:00 time was retained.

## Verification

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass locally.
- The GitHub Pages static export was built separately with `GITHUB_PAGES_BASE=/MenuIntelligent` after excluding the Node-only admin and API routes, matching the workflow.
- Chromium checks at 320–1440 px confirmed the compact branding fits without horizontal overflow, product details reveal only when opened, and dark mode remains legible. Reel checks covered first → last → first → second wrapping with wheel and keyboard, resize continuity, reduced motion, focus return on close, and no browser errors.
- Server admin and external video generation are not deployed to Pages.

The menu UI follows [WCAG 2.2 target sizing guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [Apple's motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion), and [Apple's dark mode guidance](https://developer.apple.com/design/human-interface-guidelines/dark-mode). The reel uses [native CSS scroll snapping](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type) and a [scrollend event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event) with a timer fallback for older browsers. Video loading uses posters and active-slide playback in line with [web.dev's video performance guidance](https://web.dev/learn/performance/video-performance).

## Video generation

The existing provider remains under `src/lib/video/`. It uses `XAI_API_KEY` when configured. Without it, the stub uses ffmpeg to make a still-poster loop; this is not a generated rotating video.
