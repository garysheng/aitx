import { ASSETS, CATEGORIES } from "@/lib/brand";
import AssetCard from "./AssetCard";

export default function AssetGallery() {
  return (
    <div className="flex flex-col gap-12">
      {CATEGORIES.map((cat) => {
        const items = ASSETS.filter((a) => a.category === cat.key);
        if (items.length === 0) return null;
        return (
          <section key={cat.key} id={cat.key}>
            <h2 className="font-display mb-4 text-2xl font-bold">{cat.label}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => <AssetCard key={a.id} asset={a} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
