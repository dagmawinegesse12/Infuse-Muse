import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "shortDescription", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 6 }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
    defineField({ name: "priceCents", type: "number", validation: (Rule) => Rule.required().min(100) }),
    defineField({ name: "currency", type: "string", initialValue: "CAD" }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "seasonal", type: "boolean", initialValue: false }),
    defineField({ name: "tastingNotes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ingredients", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "caffeineLevel", type: "string", options: { list: ["Low", "Medium", "High", "Herbal"] } }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text", rows: 3 })
  ]
});
