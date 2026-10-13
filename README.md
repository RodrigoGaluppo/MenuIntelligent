# The Cork — seasonal visual menu

Redesigned from `/home/russo/menuintelligente` using the September 2026 menu and the supplied Google document. The original project stays unchanged.

## GitHub Pages

The included workflow builds and deploys the visitor menu to GitHub Pages whenever changes are pushed to `main` or `master`; it can also be started with **Actions → Deploy Cork to GitHub Pages → Run workflow**.

The Pages build uses Next.js static export, with the repository name as the URL base path so images, videos and the menu PDF load from a project Pages URL. GitHub Pages cannot run the app’s Node admin and API routes. The workflow omits those routes from its temporary build checkout; they remain available in the repository for local/server deployment.

After pushing the project to a GitHub repository, set its Pages source to **GitHub Actions** in **Settings → Pages** if needed. The deployment workflow will then publish the visitor menu. The local admin still requires a Node server.

## Local setup

```bash
cd /home/russo/cork
npm ci
npm run dev
```

Public menu: http://localhost:3000  
Admin: http://localhost:3000/admin

Production commands for a regular Node server are `npm run build` and `npm start`.

## Local visual preview

Open `.preview/index.html` in a browser. It uses a local React 18 UMD/Babel preview harness and the site's source components and current data. This snapshot is for inspection; it does not run the Next server or admin API.

Desktop, mobile and menu screenshots are in `.preview/`.

## Menu and design

- Cream, deep green and olive palette inspired by The Cork interior; editorial layout with dish photography.
- 23 dishes from the September 2026 menu with prices and weights.
- Beef tartare portions: 100 g / 72 PLN and 200 g / 86 PLN.
- Optional chicken, prawns and beef additions for Green Plate and porcini risotto.
- Polish, English and Ukrainian navigation, search, filters and accessible dish details.
- Preserved all 23 dish posters and eight finished videos. Other dishes use still photos.
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

- Strict TypeScript 5.9.3 checks passed with zero diagnostics for menu components, types, data and translations.
- Menu data has 23 unique IDs, positive prices, all poster files and all eight referenced video files.
- 17 desktop/mobile browser checks passed, covering language switching, filters and reset, dish details, focus handling, pricing, keyboard navigation and photo fallback.
- A complete local Next production build could not be run in this environment because npm startup is blocked by `bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted`. GitHub Actions installs dependencies and builds the Pages export after a repository is supplied.
- Server admin and external video generation have not been deployed to Pages.

## Video generation

The existing provider remains under `src/lib/video/`. It uses `XAI_API_KEY` when configured. Without it, the stub uses ffmpeg to make a still-poster loop; this is not a generated rotating video.
