// The facts about this post that the page, its OG card, the index and the
// feed all need. The writing itself is hardcoded in page.tsx — every post
// here gets its own design, so there is no shared post shape beyond this.
export const post = {
  path: "/blog/abandon-adulting-club",
  // Full title for <title>, OG and the feed; split for the page and index.
  title: "Experiment 1: Abandon Adulting Club",
  eyebrow: "Experiment 1",
  heading: "Abandon Adulting Club",
  // Naman's opening line of the thesis, verbatim.
  description:
    "When we were kids, we had a lot of fundamentals right. As we became adults, we lost touch of them.",
  date: "2026-09-03",
  dateLabel: "3 Sep 2026",
} as const;
