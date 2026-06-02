export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  category: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'best-banana-cake-in-lagos',
    title: 'Why PopMerry Makes the Best Banana Cake in Lagos',
    excerpt: "We break down exactly what goes into every loaf — and why it tastes unlike anything else you've tried.",
    date: '2026-05-10',
    readMins: 4,
    category: 'Behind the Scenes',
    content: '<p>If you have ever bitten into a banana cake and felt vaguely disappointed — dense, dry, or just banana-flavoured sugar — you will understand what we were trying to fix when we started PopMerry Foods.</p><h2>It starts with the bananas</h2><p>Most commercial bakers use under-ripe bananas because they are firmer and easier to handle. We do the opposite. Our bananas are ripened until the skins are almost fully black — that is when the starch has fully converted to sugar, giving you that deep, naturally sweet flavour that you just cannot fake with essence.</p><h2>Real butter. Always.</h2><p>We use unsalted European-style butter in every bake. It is more expensive. It is worth it. The difference in flavour between real butter and margarine is unmistakable.</p><h2>We never pre-bake</h2><p>Every order is baked the morning of delivery. When your cake arrives, it was in our oven within the last few hours.</p><h2>Order yours</h2><p>Try the <a href="/products/bc-classic">Classic Banana Cake</a> or go indulgent with the <a href="/products/bc-cream-cheese">Cream Cheese Frosted</a>.</p>',
  },
  {
    slug: 'how-to-order-custom-cake-for-events',
    title: 'How to Order Custom Cakes for Events (Without the Stress)',
    excerpt: "Planning a birthday, wedding, or baby shower? Here's how to get a custom cake sorted.",
    date: '2026-05-18',
    readMins: 5,
    category: 'Event Planning',
    content: '<p>Ordering a custom cake for an event in Lagos can feel overwhelming. Here is how we make it simple at PopMerry.</p><h2>Start at least 5 days ahead</h2><p>For events, earlier is always better. For large events (50+ people), we recommend 10-14 days.</p><h2>Know your quantities</h2><p>One standard banana cake serves 12-16 people as a dessert. For croissant platters, count 2 per person for breakfast. Popcorn works well as a reception snack — 1 large bag per 3 guests.</p><h2>What to include in your request</h2><ul><li>Event date and delivery time</li><li>Number of guests</li><li>Flavour preferences and dietary restrictions</li><li>Delivery address</li></ul><h2>Submit your request</h2><p>Use our <a href="/custom-order">custom order form</a> and we will respond within 24 hours.</p>',
  },
  {
    slug: 'croissants-in-nigeria-what-to-look-for',
    title: 'Croissants in Nigeria: What Separates the Real Thing from the Rest',
    excerpt: "Not all croissants are created equal. Here's what proper laminated pastry looks and tastes like.",
    date: '2026-05-25',
    readMins: 4,
    category: 'Baking Education',
    content: '<p>The croissant is one of the most technically demanding pastries in baking. Done properly, it has paper-thin layers of butter laminated into the dough. Done poorly, it is just a crescent-shaped bread roll.</p><h2>The honeycomb interior test</h2><p>Break a proper croissant in half. You should see a web of large, irregular air pockets. If it is dense and bread-like inside, the lamination did not work.</p><h2>The shatter test</h2><p>A properly baked croissant should shatter when you bite into it. The outer crust should be deeply golden and crispy enough to leave flakes on your shirt.</p><h2>Fresh makes all the difference</h2><p>Croissants are at their peak within 4 hours of baking. This is why we bake every morning and deliver the same day.</p><p>Try our <a href="/products/cr-butter">Classic Butter Croissant</a> or <a href="/products/cr-almond">Almond Croissant</a>.</p>',
  },
  {
    slug: 'popcorn-flavours-guide',
    title: 'Salted, Caramel, or Spicy? Your Guide to PopMerry Popcorn',
    excerpt: "Can't decide which popcorn to order? We break down each flavour and the perfect occasion.",
    date: '2026-06-01',
    readMins: 3,
    category: 'Product Guide',
    content: '<p>PopMerry popcorn is freshly popped in small batches — never pre-packaged, never stale.</p><h2>Classic Salted</h2><p>Light, airy kernels with just enough sea salt. Perfect for: movie nights, office snacking, kids events.</p><h2>Caramel</h2><p>Our most popular flavour. Golden caramel-coated kernels made in-house — no pre-made sauce. Perfect for: gifts, birthday parties, anyone with a sweet tooth.</p><h2>Spicy Pepper</h2><p>A blend of chilli and pepper that builds slowly. The heat is real but balanced. Perfect for: corporate events and anyone who needs a snack with personality.</p><p>Order via our <a href="/products?cat=popcorn">popcorn menu</a>.</p>',
  },
];
