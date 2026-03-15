import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", type: "text", rows: 5, validation: (Rule) => Rule.required() }),
    defineField({ name: "orderRank", type: "number", initialValue: 100 })
  ]
});
