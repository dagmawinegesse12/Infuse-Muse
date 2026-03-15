import { defineField, defineType } from "sanity";

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "message", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "active", type: "boolean", initialValue: true })
  ]
});
