import Link from "next/link";
import { User, Package, Heart, LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const links = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/profile", label: "Profile", icon: User },
];

export default async function AccountLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-primary-dark">My Account</h1>
        {user && <p className="mt-1 text-sm text-ink/60">Welcome back, {user.name.split(" ")[0]}</p>}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="flex gap-2 overflow-x-auto no-scrollbar lg:w-56 lg:flex-col lg:overflow-visible">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-lavender-light hover:text-primary"
            >
              <l.icon size={15} />
              {l.label}
            </Link>
          ))}
          <LogoutButton />
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
