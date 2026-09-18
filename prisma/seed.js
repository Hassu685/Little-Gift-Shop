const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const occasions = [
  { name: "Birthdays", slug: "birthdays", description: "Make their day unforgettable." },
  { name: "Anniversaries", slug: "anniversaries", description: "Celebrate every year of love." },
  { name: "Holidays", slug: "holidays", description: "Spread joy this season." },
  { name: "Graduation", slug: "graduation", description: "Big dreams, bigger gifts." },
  { name: "Weddings", slug: "weddings", description: "A new beginning, beautifully wrapped." },
  { name: "Eid", slug: "eid", description: "Share the blessings of Eid." },
  { name: "Just Because", slug: "just-because", description: "Because you care." },
];

const categories = [
  { name: "Gift Boxes", slug: "gift-boxes" },
  { name: "Flowers", slug: "flowers" },
  { name: "Teddy Bears", slug: "teddy-bears" },
  { name: "Chocolates", slug: "chocolates" },
  { name: "Mugs", slug: "mugs" },
  { name: "Mini Plants", slug: "mini-plants" },
  { name: "Personalized Gifts", slug: "personalized-gifts" },
  { name: "Keychains", slug: "keychains" },
];

const products = [
  { name: "Lavender Gift Box", price: 24.99, comparePrice: 32.99, category: "gift-boxes", occasion: "just-because", featured: true, videoUrl: "/videos/products/lavender-gift-box.mp4" },
  { name: "Teddy Bear", price: 16.99, comparePrice: 21.99, category: "teddy-bears", occasion: "birthdays", featured: true, videoUrl: "/videos/products/teddy-bear.mp4" },
  { name: "Chocolate Gift Box", price: 24.99, comparePrice: 29.99, category: "chocolates", occasion: "just-because", featured: true, videoUrl: "/videos/products/chocolate-box.mp4" },
  { name: "Motivational Mug", price: 12.99, comparePrice: 16.99, category: "mugs", occasion: "just-because", featured: true },
  { name: "Mini Plant with Pot", price: 14.99, comparePrice: 18.99, category: "mini-plants", occasion: "just-because", featured: true },
  { name: "Mini Personalized Keychain", price: 9.99, comparePrice: 13.99, category: "keychains", occasion: "graduation", featured: true },
  { name: "Lavender Bouquet", price: 17.99, comparePrice: 24.99, category: "flowers", occasion: "anniversaries", featured: true },
  { name: "Personalized Photo Frame", price: 19.99, comparePrice: 26.99, category: "personalized-gifts", occasion: "weddings", featured: false },
  { name: "Birthday Surprise Box", price: 27.99, comparePrice: 34.99, category: "gift-boxes", occasion: "birthdays", featured: false },
  { name: "Anniversary Gift Set", price: 34.99, comparePrice: 44.99, category: "gift-boxes", occasion: "anniversaries", featured: false },
  { name: "Wedding Gift Box", price: 39.99, comparePrice: 49.99, category: "gift-boxes", occasion: "weddings", featured: false },
  { name: "Graduation Gift Set", price: 29.99, comparePrice: 36.99, category: "gift-boxes", occasion: "graduation", featured: false },
  { name: "Eid Gift Box", price: 22.99, comparePrice: 28.99, category: "gift-boxes", occasion: "eid", featured: false },
  { name: "Self Care Gift Box", price: 31.99, comparePrice: 39.99, category: "gift-boxes", occasion: "just-because", featured: false },
  { name: "Couple Gift Set", price: 36.99, comparePrice: 45.99, category: "gift-boxes", occasion: "anniversaries", featured: false },
  { name: "Rose Bouquet", price: 21.99, comparePrice: 27.99, category: "flowers", occasion: "anniversaries", featured: false },
  { name: "Sunflower Bunch", price: 15.99, comparePrice: 19.99, category: "flowers", occasion: "just-because", featured: false },
  { name: "Belgian Chocolate Tray", price: 28.99, comparePrice: 35.99, category: "chocolates", occasion: "holidays", featured: false },
  { name: "Heart-Shaped Mug Set", price: 18.99, comparePrice: 23.99, category: "mugs", occasion: "anniversaries", featured: false },
  { name: "Succulent Trio", price: 19.99, comparePrice: 24.99, category: "mini-plants", occasion: "just-because", featured: false },
  { name: "Engraved Bracelet", price: 24.99, comparePrice: 29.99, category: "personalized-gifts", occasion: "birthdays", featured: false },
  { name: "Personalized Name Necklace", price: 26.99, comparePrice: 32.99, category: "personalized-gifts", occasion: "just-because", featured: false },
];

const reviewTexts = [
  "The gift arrived beautifully packed and looked even better in person. Everything felt so thoughtfully arranged.",
  "Ordered this for my sister's birthday and she couldn't stop smiling. The quality exceeded what I expected.",
  "Fast delivery and the packaging alone felt like a gift. Will definitely order again for the holidays.",
  "Such a lovely, personal touch. You can tell real care went into how it was wrapped.",
  "My fiancé loved the anniversary box — the little handwritten note was such a sweet detail.",
  "Good value for the price, and the flowers were fresher than I expected after two days in transit.",
  "This was my second order and it was just as thoughtful as the first. Highly recommend.",
  "The mug arrived without a chip and the print quality is genuinely nice, not cheap looking.",
  "Customer support helped me change the delivery address last minute and it still arrived on time.",
  "A small gift that made a big impression at the wedding. Guests kept asking where I got it.",
];

const customers = [
  "Sarah Khan", "Ali Raza", "Ayesha Malik", "Hina Sheikh", "Bilal Ahmed",
  "Fatima Noor", "Usman Tariq", "Zara Iqbal", "Hamza Farooq", "Mahnoor Aziz",
];

async function main() {
  console.log("Seeding database...");

  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.review.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.occasion.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.contactMessage.deleteMany(),
    prisma.newsletterSubscriber.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const occasionMap = {};
  for (const o of occasions) {
    const created = await prisma.occasion.create({ data: o });
    occasionMap[o.slug] = created.id;
  }

  const categoryMap = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryMap[c.slug] = created.id;
  }

  const users = [];
  for (const name of customers) {
    const email = name.toLowerCase().replace(/\s+/g, ".") + "@example.com";
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash("password123", 10),
        role: "USER",
      },
    });
    users.push(user);
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@littlegiftshop.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const admin = await prisma.user.create({
    data: {
      name: "Shop Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const createdProducts = [];
  let sku = 1000;
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: `${p.name} — thoughtfully handmade and beautifully packaged, perfect for making someone's day feel special.`,
        shortDescription: `A handmade favorite, perfect for ${p.occasion.replace("-", " ")}.`,
        price: p.price,
        comparePrice: p.comparePrice,
        stock: Math.floor(Math.random() * 40) + 5,
        sku: `LGS-${sku++}`,
        categoryId: categoryMap[p.category],
        occasionId: occasionMap[p.occasion],
        featured: p.featured,
        videoUrl: p.videoUrl || null,
        images: {
          create: [
            { url: `/images/${slug}.jpg`, alt: p.name, sortOrder: 0 },
          ],
        },
      },
    });
    createdProducts.push(created);
  }

  for (const product of createdProducts) {
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          userId: users[Math.floor(Math.random() * users.length)].id,
          productId: product.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
          isApproved: true,
        },
      });
    }
  }

  // Sample orders
  for (let i = 0; i < 6; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const quantity = Math.floor(Math.random() * 2) + 1;
    const subtotal = product.price * quantity;
    await prisma.order.create({
      data: {
        userId: user.id,
        status: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"][Math.floor(Math.random() * 4)],
        subtotal,
        discount: 0,
        shipping: subtotal > 50 ? 0 : 5,
        total: subtotal + (subtotal > 50 ? 0 : 5),
        paymentMethod: "Cash on Delivery",
        paymentStatus: "PENDING",
        shippingName: user.name,
        shippingPhone: "0300 0000000",
        shippingAddress: "123 Gulberg Road",
        shippingCity: "Lahore",
        shippingPostalCode: "54000",
        items: {
          create: [{ productId: product.id, quantity, price: product.price }],
        },
      },
    });
  }

  await prisma.coupon.createMany({
    data: [
      { code: "GIFT15", discountType: "PERCENTAGE", discountValue: 15, minimumOrder: 30, isActive: true },
      { code: "WELCOME5", discountType: "FIXED", discountValue: 5, minimumOrder: 20, isActive: true },
    ],
  });

  await prisma.blogPost.create({
    data: {
      title: "5 Thoughtful Gift Ideas for Every Occasion",
      slug: "5-thoughtful-gift-ideas",
      excerpt: "A short guide to picking gifts that feel personal, not generic.",
      content: "Choosing a gift doesn't have to be stressful. Here are five ideas that work for almost any occasion...",
      author: "Little Gift Shop Team",
      isPublished: true,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
