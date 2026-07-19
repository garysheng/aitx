"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  SPREADS,
  BOOK_TITLE,
  CLOSING_VERSE,
  CLOSING_VERSE_REF,
} from "@/data/spreads";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

// flipbook page indices: 0 = cover, 1..122 = spread halves, 123 = closing plate
const LAST_PAGE = SPREADS.length * 2 + 1;

// listen-along playback speeds, cycled by tapping the rate button
const RATES = [1, 1.25, 1.5, 1.75, 2];

type FlipEvent = { data: number };
type FlipBookHandle = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage?: (page: number) => void;
    getState?: () => string;
  };
};

function spreadForPage(p: number): number {
  if (p <= 0) return 0;
  if (p >= LAST_PAGE) return SPREADS.length + 1;
  return Math.min(SPREADS.length, Math.ceil(p / 2));
}

// #12 -> left page of spread 12; #end -> closing plate
function pageForHash(): number {
  if (typeof window === "undefined") return 0;
  const h = window.location.hash.replace("#", "");
  if (h === "end") return LAST_PAGE;
  const n = parseInt(h, 10);
  if (!Number.isFinite(n) || n < 1 || n > SPREADS.length) return 0;
  return n * 2 - 1;
}

// audio file for a flipbook page position
function audioForSpread(s: number): string {
  if (s === 0) return "/audio/cover.mp3";
  if (s > SPREADS.length) return "/audio/end.mp3";
  return `/audio/spread-${String(s).padStart(2, "0")}.mp3`;
}

// seek value space: 0 = cover, 1..N = spread number, N+1 = end (closing plate).
// This mirrors spreadForPage(), so the scrubber and the page counter agree.
const SEEK_MAX = SPREADS.length + 1;
function pageForValue(v: number): number {
  if (v <= 0) return 0;
  if (v >= SEEK_MAX) return LAST_PAGE;
  return v * 2 - 1;
}
// Art-style editions. Each swaps the whole image set (halves, cover, back,
// thumbnails) to a parallel public/ directory. Comic is the default.
type ArtStyle = "comic" | "anime";
const STYLE_KEY = "aitx-book-style";
const STYLE_DIRS: Record<ArtStyle, { pages: string; art: string; thumbs: string }> = {
  comic: { pages: "/pages", art: "/art", thumbs: "/spreads" },
  anime: { pages: "/pages-anime", art: "/art-anime", thumbs: "/spreads-anime" },
};
function thumbForValueStyle(v: number, style: ArtStyle): string {
  const dir = STYLE_DIRS[style].thumbs;
  if (v <= 0) return `${dir}/spread-00-cover.webp`;
  const s = v >= SEEK_MAX ? SPREADS.length + 1 : v;
  return `${dir}/spread-${String(s).padStart(2, "0")}.webp`;
}
// recipe key for the currently open spread (anime edition provenance)
function recipeKeyForSpread(s: number): string {
  if (s <= 0) return "spread-00-cover";
  if (s > SPREADS.length) return "spread-99-closing";
  return `spread-${String(s).padStart(2, "0")}`;
}
type Recipe = {
  model: string;
  prompt: string;
  size: string;
  quality: string;
  register: string;
  references: { path: string; role: string; sha256: string }[];
  renderedAt: string;
};
function labelForValue(v: number): string {
  if (v <= 0) return "Cover";
  if (v >= SEEK_MAX) return "The end";
  return `Spread ${v}`;
}

export default function BookReader() {
  const bookRef = useRef<FlipBookHandle | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [style, setStyle] = useState<ArtStyle>("comic");
  const [showPrompt, setShowPrompt] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [listening, setListening] = useState(false);
  const [rate, setRate] = useState(1);
  const [seekVal, setSeekVal] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showSeek, setShowSeek] = useState(false);

  const thumbFor = useCallback(
    (v: number) => thumbForValueStyle(v, style),
    [style]
  );

  // restore persisted art-style choice on mount
  useEffect(() => {
    const s = localStorage.getItem(STYLE_KEY);
    if (s === "anime" || s === "comic") setStyle(s);
  }, []);

  // Swap every spread image to the chosen edition IMPERATIVELY, without
  // re-rendering the frozen StPageFlip subtree (re-rendering it mid-life
  // triggers phantom auto-flips). We rewrite each img's src by its data-role.
  useEffect(() => {
    const root = stageRef.current;
    if (root) {
      const dirs = STYLE_DIRS[style];
      root.querySelectorAll<HTMLImageElement>("img[data-role]").forEach((img) => {
        const role = img.dataset.role;
        const n = img.dataset.n;
        let src: string | null = null;
        if (role === "cover") src = `${dirs.art}/cover-painted.webp`;
        else if (role === "back") src = `${dirs.art}/back-cover.webp`;
        else if (role === "l") src = `${dirs.pages}/${n}-l.webp`;
        else if (role === "r") src = `${dirs.pages}/${n}-r.webp`;
        if (src && !img.src.endsWith(src)) img.src = src;
      });
    }
    localStorage.setItem(STYLE_KEY, style);
  }, [style]);

  const onFlip = useCallback((e: FlipEvent) => {
    setPage(e.data);
    const s = spreadForPage(e.data);
    const hash =
      s === 0 ? " " : s > SPREADS.length ? "#end" : `#${s}`;
    window.history.replaceState(
      null,
      "",
      hash === " " ? window.location.pathname : hash
    );
  }, []);
  // StPageFlip corrupts its queue if flipNext/flipPrev land mid-animation
  // (pages then keep turning on their own); only flip from the "read" state.
  const next = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf || (pf.getState && pf.getState() !== "read")) return;
    pf.flipNext();
  }, []);
  const prev = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf || (pf.getState && pf.getState() !== "read")) return;
    pf.flipPrev();
  }, []);
  const restart = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf || (pf.getState && pf.getState() !== "read")) return;
    pf.turnToPage?.(0);
    setPage(0);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // Seek to a value in the 0..N+1 space. turnToPage() jumps instantly, which
  // (unlike flipNext/flipPrev) does not corrupt StPageFlip's queue, so it is
  // safe to call repeatedly while scrubbing. Still gated on the "read" state.
  const goTo = useCallback((v: number) => {
    const pf = bookRef.current?.pageFlip();
    if (!pf || (pf.getState && pf.getState() !== "read")) return;
    const target = pageForValue(v);
    pf.turnToPage?.(target);
    setPage(target);
    const s = spreadForPage(target);
    const hash = s === 0 ? " " : s > SPREADS.length ? "#end" : `#${s}`;
    window.history.replaceState(
      null,
      "",
      hash === " " ? window.location.pathname : hash
    );
  }, []);
  const share = useCallback(async () => {
    const url = window.location.origin + window.location.pathname;
    const data = {
      title: BOOK_TITLE,
      text: "The Origin of the AITX Community — the story of the largest AI builder community in Texas.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  }, []);

  // listen-along: play the current spread's narration; auto-flip when it ends
  const stopListening = useCallback(() => {
    setListening(false);
    audioRef.current?.pause();
  }, []);
  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }
    setListening(true);
    const el = audioRef.current;
    if (el) {
      el.src = audioForSpread(spreadForPage(page));
      el.play().catch(() => setListening(false));
    }
  }, [listening, page, stopListening]);
  const cycleRate = useCallback(() => {
    setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length]);
  }, []);

  useEffect(() => {
    if (!listening) return;
    const el = audioRef.current;
    if (!el) return;
    const src = audioForSpread(spreadForPage(page));
    if (!el.src.endsWith(src)) {
      el.src = src;
      el.play().catch(() => setListening(false));
    }
    el.playbackRate = rate;
    const onEnded = () => {
      if (page >= LAST_PAGE) {
        setListening(false);
        return;
      }
      const pf = bookRef.current?.pageFlip();
      if (!pf || (pf.getState && pf.getState() !== "read")) {
        setListening(false);
        return;
      }
      pf.flipNext();
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [listening, page, rate]);


  // Prefetch neighboring spread art so a first-time flip never flashes a
  // half-loaded page (lazy-loading only fetches once StPageFlip reveals it).
  useEffect(() => {
    const s = spreadForPage(page);
    for (let k = Math.max(0, s - 1); k <= Math.min(SEEK_MAX, s + 3); k++) {
      const img = new Image();
      img.src = thumbFor(k);
    }
  }, [page, thumbFor]);

  // deep link: jump to the spread in the URL hash once the book exists
  useEffect(() => {
    const target = pageForHash();
    if (target === 0) return;
    // StPageFlip mounts async under dynamic(); poll briefly until ready
    let tries = 0;
    const t = setInterval(() => {
      const pf = bookRef.current?.pageFlip();
      tries += 1;
      if (pf?.turnToPage) {
        pf.turnToPage(target);
        setPage(target);
        clearInterval(t);
      } else if (tries > 40) {
        clearInterval(t);
      }
    }, 120);
    return () => clearInterval(t);
  }, []);

  // live deep-link: when the user edits the URL hash (e.g. #12 -> #30), jump.
  // The reader updates the hash with replaceState, which does NOT fire
  // "hashchange", so this only responds to genuine user edits (no loop).
  useEffect(() => {
    const onHash = () => {
      const pf = bookRef.current?.pageFlip();
      if (!pf || (pf.getState && pf.getState() !== "read")) return;
      const target = pageForHash();
      pf.turnToPage?.(target);
      setPage(target);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // keep the scrubber in step with page flips, except while the user is dragging
  useEffect(() => {
    if (!seeking) setSeekVal(spreadForPage(page));
  }, [page, seeking]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowGrid(false);
        return;
      }
      if (showGrid) return; // don't flip the book underneath the open grid
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, showGrid]);

  const spread = spreadForPage(page);
  const atEnd = spread > SPREADS.length;

  // Load the provenance recipe (anime edition) for the open spread while the
  // "how this page was made" panel is showing.
  useEffect(() => {
    if (!showPrompt) return;
    const key = recipeKeyForSpread(spread);
    let cancelled = false;
    setRecipeLoading(true);
    fetch(`/recipes/anime/${key}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Recipe | null) => {
        if (!cancelled) {
          setRecipe(data);
          setRecipeLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecipe(null);
          setRecipeLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [showPrompt, spread]);

  const pages = useMemo(() => {
    const els = [
      <div className="page" key="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/cover-painted.webp" alt="The Origin of the AITX Community" data-role="cover" />
      </div>,
    ];
    for (const s of SPREADS) {
      const n = String(s.n).padStart(2, "0");
      els.push(
        <div className="page page--left" key={`${n}l`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/pages/${n}-l.webp`} alt="" loading="lazy" data-role="l" data-n={n} />
        </div>,
        <div className="page page--right" key={`${n}r`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/pages/${n}-r.webp`} alt="" loading="lazy" data-role="r" data-n={n} />
          <div
            className={`page-caption font-body page-caption--${s.pos ?? "bottom"}`}
          >
            {s.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      );
    }
    els.push(
      <div className="page page--plate page--backcover" key="end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/back-cover.webp" alt="" data-role="back" />
        <div className="plate-inner plate-inner--backcover">
          <p
            className="font-body"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
              fontStyle: "italic",
              lineHeight: 1.8,
              maxWidth: "30ch",
            }}
          >
            {CLOSING_VERSE}
          </p>
          {CLOSING_VERSE_REF ? (
            <p
              className="font-display"
              style={{ fontSize: "0.8rem", letterSpacing: "0.18em", opacity: 0.9 }}
            >
              {CLOSING_VERSE_REF}
            </p>
          ) : null}
        </div>
      </div>
    );
    return els;
  }, []);

  // Freeze the flipbook element so page-counter re-renders never reach the
  // StPageFlip subtree (re-rendering it mid-flip triggers phantom auto-flips).
  const book = useMemo(
    () => (
      // @ts-expect-error react-pageflip types predate React 19
      <HTMLFlipBook
        ref={bookRef}
        width={480}
        height={640}
        size="stretch"
        minWidth={220}
        maxWidth={640}
        minHeight={294}
        maxHeight={854}
        showCover={true}
        maxShadowOpacity={0.45}
        flippingTime={850}
        usePortrait={false}
        mobileScrollSupport={true}
        clickEventForward={false}
        disableFlipByClick={true}
        onFlip={onFlip}
        className=""
        style={{ margin: "0 auto" }}
      >
        {pages}
      </HTMLFlipBook>
    ),
    [pages, onFlip]
  );

  return (
    <div className="flex w-full flex-col items-center gap-7">
      <div className="edition-bar rise" style={{ animationDelay: "0.15s" }}>
        <div className="edition-toggle" role="group" aria-label="Art style">
          <button
            className={`edition-opt font-display${style === "comic" ? " edition-opt--on" : ""}`}
            aria-pressed={style === "comic"}
            onClick={() => setStyle("comic")}
          >
            Comic
          </button>
          <button
            className={`edition-opt font-display${style === "anime" ? " edition-opt--on" : ""}`}
            aria-pressed={style === "anime"}
            onClick={() => setStyle("anime")}
          >
            Anime
          </button>
        </div>
        <button
          className={`prompt-btn font-display${showPrompt ? " prompt-btn--on" : ""}`}
          aria-pressed={showPrompt}
          aria-label="How this page was made"
          onClick={() => setShowPrompt((v) => !v)}
        >
          <span aria-hidden>ⓘ</span> prompt
        </button>
      </div>
      <div ref={stageRef} className="book-shadow rise w-full" style={{ animationDelay: "0.25s", position: "relative" }}>
        {book}
        {spread === 0 && (
          <button onClick={next} className="cta-hint cta-hint--open font-body" aria-label="Open the book">
            This is a real flip-book: drag a page corner, tap the arrows, or use your keyboard.
            <span className="cta-hint__action font-display">OPEN THE BOOK →</span>
          </button>
        )}
        {atEnd && (
          <button onClick={share} className="cta-hint cta-hint--share cta-hint--end font-body" aria-label="Share this book">
            Know a builder who should be in this room?
            <span className="cta-hint__action font-display">
              {shared ? "LINK COPIED ✓" : "SHARE THIS BOOK ↗"}
            </span>
          </button>
        )}
      </div>

      <audio ref={audioRef} preload="none" />

      {/* controls */}
      <div className="controls rise flex flex-col items-center gap-3" style={{ animationDelay: "0.45s" }}>
        {showSeek && (
        <div className="seek">
          <button
            onClick={() => setShowGrid(true)}
            aria-label="Show all pages"
            className="grid-btn"
          >
            <span aria-hidden>▦</span>
          </button>
          <div className="seek-track-wrap">
            <input
              type="range"
              className="seek-range"
              min={0}
              max={SEEK_MAX}
              step={1}
              value={seekVal}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSeeking(true);
                setSeekVal(v);
                goTo(v);
              }}
              onPointerDown={() => setSeeking(true)}
              onPointerUp={() => {
                goTo(seekVal);
                setSeeking(false);
              }}
              onPointerCancel={() => setSeeking(false)}
              onBlur={() => setSeeking(false)}
              aria-label="Seek to a page"
              aria-valuetext={labelForValue(seekVal)}
            />
            {seeking && (
              <div
                className="seek-preview"
                style={{ left: `${(seekVal / SEEK_MAX) * 100}%` }}
              >
                <img src={thumbFor(seekVal)} alt="" />
                <span className="font-display">{labelForValue(seekVal)}</span>
              </div>
            )}
          </div>
        </div>
        )}
        <div className="flex items-center gap-6">
          <button onClick={prev} aria-label="Previous page" className="nav-btn nav-btn--prev">
            ←
          </button>
          <button
            onClick={toggleListening}
            aria-label={listening ? "Pause narration" : "Listen along"}
            className={`listen-btn font-display${listening ? " listen-btn--on" : ""}`}
          >
            {listening ? (
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden fill="currentColor">
                <rect x="5" y="4" width="5" height="16" rx="1" />
                <rect x="14" y="4" width="5" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden
                fill="currentColor"
                style={{ marginLeft: "2px" }}
              >
                <path d="M7 4.8v14.4c0 .83.92 1.33 1.62.9l11.4-7.2c.65-.41.65-1.39 0-1.8L8.62 3.9C7.92 3.47 7 3.97 7 4.8z" />
              </svg>
            )}
          </button>
          <button
            onClick={cycleRate}
            aria-label={`Playback speed ${rate}x, tap to change`}
            className={`rate-btn${rate !== 1 ? " rate-btn--on" : ""}`}
          >
            {rate}x
          </button>
          {atEnd ? (
            <button
              onClick={restart}
              className="font-display text-sm tracking-[0.18em] restart-btn counter-slot"
              style={{ color: "var(--gold-deep)" }}
            >
              ↺ READ AGAIN
            </button>
          ) : (
            <p
              className="font-display text-sm tracking-[0.18em] counter-slot"
              style={{ color: "var(--gold-deep)" }}
            >
              {spread >= 1 ? (
                <>
                  <span className="counter-num">{spread}</span>
                  <span className="counter-of">of</span>
                  <span className="counter-num">{SPREADS.length}</span>
                </>
              ) : (
                "COVER"
              )}
            </p>
          )}
          <button
            onClick={() => setShowSeek((v) => !v)}
            aria-label={showSeek ? "Hide the page seek bar" : "Seek between pages"}
            aria-pressed={showSeek}
            className={`seek-toggle font-display${showSeek ? " seek-toggle--on" : ""}`}
          >
            <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8.8 8.6 7.4 7.2 2.6 12l4.8 4.8 1.4-1.4L6.4 13h11.2l-2.4 2.4 1.4 1.4L21.4 12l-4.8-4.8-1.4 1.4 2.4 2.4H6.4l2.4-2.4z"/></svg>
          </button>
          <button onClick={next} aria-label="Next page" className="nav-btn nav-btn--next">
            →
          </button>
        </div>

      </div>

      {showPrompt && (
        <div
          className="prompt-overlay"
          onClick={() => setShowPrompt(false)}
          role="dialog"
          aria-modal="true"
          aria-label="How this page was made"
        >
          <div className="prompt-panel" onClick={(e) => e.stopPropagation()}>
            <div className="prompt-head">
              <span className="font-display">
                HOW THIS PAGE WAS MADE ·{" "}
                {spread <= 0
                  ? "COVER"
                  : spread > SPREADS.length
                  ? "CLOSING"
                  : `SPREAD ${spread}`}
              </span>
              <button
                onClick={() => setShowPrompt(false)}
                aria-label="Close"
                className="prompt-close"
              >
                ✕
              </button>
            </div>
            <div className="prompt-body">
              {recipeLoading ? (
                <p className="prompt-note">Loading recipe…</p>
              ) : recipe ? (
                <>
                  {style === "comic" && (
                    <p className="prompt-note">
                      Showing the <strong>anime edition</strong> recipe. The comic
                      edition predates provenance capture.
                    </p>
                  )}
                  <div className="prompt-meta">
                    <span className="prompt-tag">register: {recipe.register}</span>
                    <span className="prompt-tag">model: {recipe.model}</span>
                    <span className="prompt-tag">{recipe.size}</span>
                    <span className="prompt-tag">quality: {recipe.quality}</span>
                  </div>
                  <div className="prompt-label font-display">PROMPT</div>
                  <pre className="prompt-code">{recipe.prompt}</pre>
                  <div className="prompt-label font-display">REFERENCES</div>
                  <ul className="prompt-refs">
                    {recipe.references.map((ref) => (
                      <li key={ref.sha256}>
                        <span className="prompt-ref-name">
                          {ref.path.split("/").pop()}
                        </span>
                        <span className="prompt-ref-role">{ref.role}</span>
                        <span className="prompt-ref-sha">
                          {ref.sha256.slice(0, 12)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="prompt-note">
                  Recipe available for the anime edition. Flip to a story spread to
                  see how it was generated.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showGrid && (
        <div
          className="page-grid-overlay"
          onClick={() => setShowGrid(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Jump to a page"
        >
          <div className="page-grid-panel" onClick={(e) => e.stopPropagation()}>
            <div className="page-grid-head">
              <span className="font-display">JUMP TO A PAGE</span>
              <button
                onClick={() => setShowGrid(false)}
                aria-label="Close"
                className="page-grid-close"
              >
                ✕
              </button>
            </div>
            <div className="page-grid">
              {[0, ...SPREADS.map((s) => s.n), SEEK_MAX].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    goTo(v);
                    setShowGrid(false);
                  }}
                  className={`page-grid-item${spread === v ? " page-grid-item--current" : ""}`}
                >
                  <img src={thumbFor(v)} alt="" loading="lazy" />
                  <span className="font-display">
                    {v === 0 ? "Cover" : v === SEEK_MAX ? "End" : v}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
