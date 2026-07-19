"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import FlyerCanvas from "./FlyerCanvas";
import { CITIES, EVENT_KINDS, SPONSORS, type FlyerValues } from "@/lib/events/flyer";

const OR = "#ff4201";
const PREVIEW = 460; // on-screen size; capture stays true-size 1080

export default function FlyerStudio() {
  const [kindId, setKindId] = useState(EVENT_KINDS[0].id);
  const [cityId, setCityId] = useState("austin");
  const [subtitle, setSubtitle] = useState("");
  const [picked, setPicked] = useState<string[]>(["nvidia"]);
  const [uploads, setUploads] = useState<{ label: string; src: string }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const sponsors: FlyerValues["sponsors"] = [
    ...SPONSORS.filter((s) => picked.includes(s.id)).map((s) => ({ label: s.label, src: s.src })),
    ...uploads,
  ];
  const values: FlyerValues = { kindId, cityId, subtitle, sponsors };

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setUploads((u) => [...u, { label: f.name, src: String(reader.result) }]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  }

  async function download() {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 1, cacheBust: true, width: 1080, height: 1080 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `aitx-${kindId}-${cityId}.png`;
    a.click();
  }

  const field = "rounded-xl border px-4 py-3 outline-none";
  const border = { borderColor: "#e0d6c2", background: "#fffdf9" };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      {/* controls */}
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Event type</div>
          <div className="flex flex-wrap gap-2">
            {EVENT_KINDS.map((k) => (
              <button key={k.id} onClick={() => setKindId(k.id)}
                className="rounded-full border px-3 py-1.5 text-sm font-medium"
                style={{ borderColor: kindId === k.id ? OR : "#e0d6c2", background: kindId === k.id ? `${OR}14` : "#fffdf9", color: kindId === k.id ? "#c2340a" : "var(--ink)" }}>
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">City</div>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button key={c.id} onClick={() => setCityId(c.id)}
                className="rounded-full border px-3 py-1.5 text-sm font-medium"
                style={{ borderColor: cityId === c.id ? OR : "#e0d6c2", background: cityId === c.id ? `${OR}14` : "#fffdf9", color: cityId === c.id ? "#c2340a" : "var(--ink)" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Subtitle (optional)</div>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={60}
            placeholder="e.g. Third Thursday · 6pm · free" className={`w-full ${field}`} style={border} />
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Sponsors (different per city)</div>
          <div className="flex flex-wrap items-center gap-2">
            {SPONSORS.map((s) => (
              <button key={s.id} onClick={() => toggle(s.id)}
                className="rounded-full border px-3 py-1.5 text-sm font-medium"
                style={{ borderColor: picked.includes(s.id) ? OR : "#e0d6c2", background: picked.includes(s.id) ? `${OR}14` : "#fffdf9", color: picked.includes(s.id) ? "#c2340a" : "var(--ink)" }}>
                {s.label}{picked.includes(s.id) ? " ✓" : ""}
              </button>
            ))}
            <label className="cursor-pointer rounded-full border border-dashed px-3 py-1.5 text-sm font-medium text-[color:var(--muted)]" style={{ borderColor: "#c9bda3" }}>
              + Upload logo
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
            </label>
          </div>
          {uploads.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
              {uploads.map((u, i) => (
                <span key={i} className="rounded-full bg-[#f2ead9] px-2 py-1">
                  {u.label.slice(0, 18)} <button onClick={() => setUploads((x) => x.filter((_, j) => j !== i))} className="ml-1 font-bold">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button onClick={download} className="mt-1 w-fit rounded-xl px-6 py-3 font-semibold text-white" style={{ background: OR }}>
          ↓ Download flyer (1080×1080)
        </button>
      </div>

      {/* live preview — true-size 1080 captured, shown scaled */}
      <div className="flex flex-col items-center gap-3">
        <div style={{ width: PREVIEW, height: PREVIEW }}>
          <div style={{ transform: `scale(${PREVIEW / 1080})`, transformOrigin: "top left" }}>
            <div ref={cardRef}>
              <FlyerCanvas size={1080} values={values} />
            </div>
          </div>
        </div>
        <span className="text-xs text-[color:var(--muted)]">live preview · downloads at full resolution</span>
      </div>
    </div>
  );
}
