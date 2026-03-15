import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", type: "string" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "region", type: "string" }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "instagramUrl", type: "url" })
  ]
});
