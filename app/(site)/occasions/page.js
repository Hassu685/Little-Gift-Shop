import Link from "next/link";
import { Cake, HeartHandshake, TreePine, GraduationCap, Gem, Gift as GiftIcon, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Shop by Occasion",
  description: "Find the perfect handmade gift for birthdays, anniversaries, weddings, graduations, Eid and every special moment.",
};

const iconMap = {
  birthdays: Cake,
  anniversaries: HeartHandshake,
  holidays: TreePine,
  graduation: GraduationCap,
  weddings: Gem,
  eid: GiftIcon,
  "just-because": GiftIcon,
};

async function getOccasions() {
  try {
    return await prisma.occasion.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Occasions fetch failed:", err.message);
    return [];
  }
}

export default async function OccasionsPage() {
  const occasions = await getOccasions();

  return (
    <section className="bg-lavender-watercolor bg-cream py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-10 text-center">
          <span className="section-label">Every Moment Matters</span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Shop by Occasion
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink/60">
            Find the perfect gift for every special moment — handpicked and made with love.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((o) => {
            const Icon = iconMap[o.slug] || GiftIcon;
            return (
              <Link
                key={o.id}
                href={`/occasions/${o.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lavender-light text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <div className="flex-1">
                  <h2 className="font-heading text-base font-semibold text-ink">{o.name}</h2>
                  <p className="mt-0.5 text-xs text-ink/50">{o._count.products} gift{o._count.products !== 1 ? "s" : ""}</p>
                </div>
                <ArrowRight size={16} className="text-primary/40 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
