import type { BrandAsset } from "@/lib/brand";

export default function AssetCard({ asset }: { asset: BrandAsset }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-center bg-[color:var(--paper)] p-4" style={{ aspectRatio: "1 / 1" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.file} alt={asset.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="font-display text-lg font-semibold">{asset.name}</div>
        <p className="text-sm text-[color:var(--muted)]">{asset.blurb}</p>
        {asset.composedFrom && (
          <p className="mt-1 text-xs text-[color:var(--muted)]">Built from: {asset.composedFrom.join(", ")}</p>
        )}
        <a
          href={asset.file}
          download={asset.downloadName}
          className="mt-3 inline-block rounded-md bg-[color:var(--orange)] px-3 py-1.5 text-center text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)]"
        >
          Download
        </a>
      </div>
    </div>
  );
}
