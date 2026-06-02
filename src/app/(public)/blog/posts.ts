export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'best-banana-cake-lagos',
    title: 'Why PopMerry Makes the Best Banana Cake in Lagos',
    excerpt: 'What separates a great banana cake from an unforgettable one? We break down exactly what goes into every loaf we bake.',
    category: 'Behind the Scenes',
    date: 'May 2025',
    image: 'https://images.unsplash.com/photo-1569762404472-026308ba6b64?auto=format&fit=crop&w=800&h=500&q=80',
    content: `
## The Secret is in the Bananas

Most bakeries use barely-ripe bananas. We wait until ours are almost black — that's when the natural sugars are fully developed and the flavour is at its deepest.

## No Shortcuts on Butter

We use full-fat, real butter. No margarine, no substitutes. You can taste the difference immediately.

## Baked Fresh Every Morning

Your cake is never more than a few hours old when it reaches you. We don't bake in batches for the week — we bake to order.

## The Right Flour Ratio

Getting the moisture right in a banana cake is an art. Too much flour and it's dry. Too little and it doesn't hold. We've tested our recipe hundreds of times to find the sweet spot.

Whether you choose our Classic, Chocolate Chip, Walnut, or Caramel Drizzle — every variant starts with the same foundation of quality ingredients and genuine care.

[Order yours today →](/products?cat=banana-cake)
    `.trim(),
  },
  {
    slug: 'how-to-order-catering-lagos',
    title: 'How to Order Catering for Your Office or Event in Lagos',
    excerpt: 'Planning office breakfast, a team retreat, or a corporate event? Here\'s everything you need to know about ordering in bulk from PopMerry.',
    category: 'Event Planning',
    date: 'April 2025',
    image: 'https://images.unsplash.com/photo-1556742059-47b93231f536?auto=format&fit=crop&w=800&h=500&q=80',
    content: `
## Why More Lagos Companies Choose PopMerry for Office Catering

Office catering isn't just about filling stomachs. It's about giving your team something to look forward to — a moment in the day that feels like a treat.

## What We Offer for Corporates

- **Fresh croissants**: Butter, almond, ham & cheese, Nutella, and more — delivered warm
- **Banana cakes**: Whole cakes or slices, beautifully packaged
- **Popcorn packs**: Perfect for meetings and conference snacks
- **Custom bundles**: We'll build a menu around your team size and preferences

## How to Get Started

1. **Tell us your headcount**: We scale the order based on team size
2. **Pick your items**: Mix and match from our menu
3. **Choose frequency**: Daily, weekly, or one-off
4. **We handle the rest**: Delivery scheduled at the time your team arrives

## Volume Pricing

Regular orders unlock better rates. Get in touch via our [catering form](/catering) or WhatsApp for a custom quote.

The earlier you book, the better — our kitchen runs on a production schedule and we may need 24-48 hours notice for large orders.
    `.trim(),
  },
  {
    slug: 'types-of-croissants-guide',
    title: 'A Guide to Our 6 Croissant Varieties — and How to Choose',
    excerpt: 'Classic butter? Almond? Ham & Cheese? We walk you through every croissant we make so you can order exactly what you\'re craving.',
    category: 'Product Guide',
    date: 'March 2025',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&h=500&q=80',
    content: `
## The Classic Butter Croissant

If you've never had a proper croissant, start here. Shatteringly crisp on the outside, pillowy and warm inside. This is the one our bakers are most proud of.

**Best for**: First-timers, croissant purists, breakfast.

## The Almond Croissant

Rich almond cream inside, flaked almonds on top, dusted with powdered sugar. Our bestseller and the one customers order again and again.

**Best for**: A weekend treat, afternoon tea, impressing guests.

## Pain au Chocolat

Dark chocolate tucked inside layers of butter pastry. Slightly less sweet than you'd expect — in the best possible way.

**Best for**: Chocolate lovers, children, pairing with coffee.

## Ham & Cheese Croissant

Premium smoked ham and melted cheese folded into a golden, flaky croissant. The savoury option.

**Best for**: Brunch, lunch, anyone who finds sweet pastries too rich.

## Strawberry Jam Croissant

Sweet strawberry jam nestled in buttery flaky layers. Light, fruity, and delightful.

**Best for**: Those who prefer fruit flavours, lighter breakfasts.

## Nutella Croissant

Creamy Nutella swirled inside a warm, flaky croissant. The indulgent choice.

**Best for**: Nutella lovers, children, dessert croissants.

---

Not sure which to choose? Order the **Morning Delight Bundle** — you get a mix of classics plus a slice of banana cake.

[Browse croissants →](/products?cat=croissant)
    `.trim(),
  },
];
