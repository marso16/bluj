import { defineField, defineType } from "sanity";

export const weeklySpecialSchema = defineType({
  name: "weeklySpecial",
  title: "Weekly Special",
  type: "document",
  fields: [
    defineField({
      name: "item",
      title: "Item",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Price (e.g. $1.99 or 2 for $3)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Note (optional)",
      type: "string",
      description: "e.g. 'All locations' or 'Deli only'",
    }),
    defineField({
      name: "active",
      title: "Active this week",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
