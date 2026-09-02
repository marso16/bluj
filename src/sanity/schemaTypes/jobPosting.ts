import { defineField, defineType } from "sanity";

export const jobPostingSchema = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Concord, NH or All Locations",
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-Time", value: "full-time" },
          { title: "Part-Time", value: "part-time" },
          { title: "Seasonal", value: "seasonal" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [{ title: "Title", name: "title", by: [{ field: "title", direction: "asc" }] }],
});
