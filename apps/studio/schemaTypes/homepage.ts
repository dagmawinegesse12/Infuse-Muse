import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subheadline", type: "text", rows: 4 }),
    defineField({ name: "ctaPrimary", type: "string" }),
    defineField({ name: "ctaSecondary", type: "string" }),
    defineField({ name: "featuredSlugs", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "seasonalSlugs", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "announcement", type: "string" })
  ]
});
