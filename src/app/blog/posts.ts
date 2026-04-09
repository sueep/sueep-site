export type PaintingBlogPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  excerpt: string;
  /** Plain text; split into paragraphs by blank lines */
  body: string;
};

export const PAINTING_BLOG_POSTS: PaintingBlogPost[] = [
  {
    slug: "interior-paint-prep-homeowners-guide",
    title: "Interior Paint Prep: What Homeowners Should Know Before the Crew Arrives",
    description:
      "Room-by-room prep steps that protect floors and furniture, speed up your residential painting job, and help crews deliver cleaner lines in Greater Philadelphia.",
    datePublished: "2026-04-02",
    excerpt:
      "Good prep is half the finish. Learn what to move, what to expect, and how to set your home up for a smooth interior paint project.",
    body: `Professional interior painting starts long before the first coat. When floors are cleared, outlets are accessible, and fragile items are stowed, crews can focus on surface prep, patching, and application—which is what delivers the smooth, durable finish you want.

Start by moving small furniture and décor out of the room or grouping larger pieces in the center under a drop cloth. Remove wall hangings and take photos if you want to rehang them in the same spots. If you are unsure whether to remove something, ask your estimator; most teams will specify what they need cleared before day one.

Expect some dust from sanding and minor repairs. Reputable painters contain work areas and clean up daily, but sealing closets or covering beds in occupied homes is worth discussing in advance. For kitchens and baths, plan around dry times if cabinets or trim are included in scope.

Finally, communicate early about color placement, sheen (e.g., eggshell vs. satin in baths), and any areas that need extra attention—staircases, high walls, or repaired drywall. Clear expectations and a prepared space help your residential painting project stay on schedule and on budget.`,
  },
  {
    slug: "repaint-before-selling-your-home",
    title: "When to Repaint Before Selling Your Home",
    description:
      "How fresh paint affects buyer perception, which rooms matter most, and how to time a repaint with your listing in PA, NJ, and nearby markets.",
    datePublished: "2026-04-05",
    excerpt:
      "A strategic repaint can support asking price and faster showings. Here is how to decide if it is worth it before you list.",
    body: `Buyers notice walls, trim, and ceilings the moment they walk in. Scuffs, dated colors, and uneven touch-ups can signal deferred maintenance—even when the rest of the home is solid. A cohesive, neutral palette helps people imagine living in the space and photographs better for online listings.

Focus first on high-impact areas: the entry, main living space, primary suite, and kitchen. If budget is tight, repainting trim and doors alone can refresh a room more than many sellers expect. Exterior paint matters too, especially for curb appeal and first impressions during drive-bys.

Timing matters. Schedule painting so surfaces are fully cured before open houses, and allow buffer for any touch-ups after move-out or staging. Work with a team that can quote quickly and lock dates that align with your agent’s marketing plan.

You do not need to chase trends. Warm whites, soft greiges, and restrained accents tend to appeal broadly. Your painter and real estate professional can help you pick finishes that look current without feeling sterile.`,
  },
  {
    slug: "choosing-sheen-residential-painting",
    title: "Choosing the Right Paint Sheen for Each Room",
    description:
      "Flat, eggshell, satin, semi-gloss—where to use each finish in a residential painting project for durability, washability, and appearance.",
    datePublished: "2026-04-08",
    excerpt:
      "Sheen affects how paint looks under light and how well it stands up to cleaning. Use this room-by-room guide for smarter choices.",
    body: `Sheen describes how much light a painted surface reflects. Lower sheens hide imperfections but are harder to scrub; higher sheens are tougher and more washable but show bumps and roller marks more easily.

For most living rooms and bedrooms, eggshell is a popular balance: soft appearance with moderate cleanability. Hallways, kids’ rooms, and kitchens often benefit from satin or a scrubbable eggshell because walls take more contact. Bathrooms and laundry areas typically use satin or semi-gloss on walls and trim to resist moisture and frequent wiping.

Ceilings are usually flat or a very low sheen to minimize glare and conceal texture variation. Trim, doors, and cabinets are often semi-gloss or gloss for durability and contrast.

Always confirm with your painter’s product line—manufacturers label sheens slightly differently. A written scope that lists room, color, and sheen reduces surprises at walkthrough and helps your residential painting investment perform for years.`,
  },
];

export function getPostBySlug(slug: string): PaintingBlogPost | undefined {
  return PAINTING_BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PAINTING_BLOG_POSTS.map((p) => p.slug);
}
