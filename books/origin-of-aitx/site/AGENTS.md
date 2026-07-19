<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## StPageFlip / react-pageflip gotchas (earned 2026-07-06)

- **Phantom auto-flips**: calling `flipNext()/flipPrev()` while a flip is animating corrupts the queue and pages keep turning on their own afterward. Gate every flip on `pageFlip().getState() === "read"` (see BookReader `next`/`prev`).
- **Re-render loops**: the flipbook element is frozen with `useMemo` so page-counter state changes never re-render the StPageFlip subtree (re-rendering it mid-flip also triggers phantom flips).
- **Inline display stomping**: StPageFlip toggles page visibility with inline `display: block/none`, which overrides any `display: flex` on the page element. Put layout on an inner wrapper (`.plate-inner`), never on the page element itself.
- **position: fixed inside animated containers**: the `.rise` animation's transform makes `position: fixed` children resolve against the container, not the viewport. The landscape side-arrow media query neutralizes the transform on `.controls` first.
- **Click-to-flip drift**: `clickEventForward={false}` + `disableFlipByClick={true}` — page clicks were advancing the book on fresh loads.
- **Floating controls overlay (earned 2026-07-09)**: to pin `.controls` as a fixed bottom pill while the nav arrows flank the screen edges, keep `transform`, `filter`, and `backdrop-filter` off `.controls` AND off every ancestor of the fixed `.nav-btn--prev`/`.nav-btn--next`. Any of those on an ancestor makes it the containing block for the fixed arrows and traps them inside the pill instead of the viewport. Center the pill with `left:0;right:0;margin:0 auto;width:fit-content` (no transform) and use a plain translucent background (no backdrop-filter).
