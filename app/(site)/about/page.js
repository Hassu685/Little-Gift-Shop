import { HandHeart, Award, Users, Heart } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

export const metadata = {
  title: "About Us",
  description: "The story behind Little Gift Shop — handmade, thoughtful gifts made with love in Lahore, Pakistan.",
};

const points = [
  { icon: HandHeart, label: "Handmade With Love" },
  { icon: Award, label: "Premium Quality" },
  { icon: Users, label: "Happy Customers" },
];

export default function AboutPage() {
  return (
    <section className="bg-lavender-watercolor bg-cream py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-12 text-center">
          <span className="section-label">Our Story</span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            More Than Just a Gift Shop
          </h1>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <VideoPlayer
            src="/videos/gift-wrapping.mp4"
            poster="/images/video-posters/gift-wrapping-poster.jpg"
            className="aspect-video shadow-soft"
            muted
            loop
          />

          <div>
            <p className="text-[15px] leading-relaxed text-ink/70">
              We started Little Gift Shop with a simple dream — to turn ordinary moments into
              extraordinary memories. Every gift we create is made with love, care and a little
              bit of magic. Because we believe, it&apos;s not just a gift — it&apos;s a feeling.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              Based in Lahore, Pakistan, our small team hand-wraps every order and personally checks
              each piece before it leaves our workshop. From a first birthday to a fiftieth
              anniversary, we want every gift we send out into the world to feel like it was made
              specifically for the person receiving it — because it was.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {points.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-light text-primary">
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-medium text-ink/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-primary/10 bg-white p-8 text-center shadow-card">
          <Heart size={26} className="mx-auto text-pink" fill="currentColor" />
          <p className="mt-4 font-script text-2xl text-primary">
            &quot;Because every gift tells a story&quot;
          </p>
          <p className="mt-3 text-sm text-ink/60">
            Thank you for letting us be a small part of your big moments.
          </p>
        </div>
      </div>
    </section>
  );
}
