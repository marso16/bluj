import { defineField, defineType } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Fuel", value: "fuel" },
          { title: "Convenience", value: "convenience" },
          { title: "Deli", value: "deli" },
          { title: "Food", value: "food" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
