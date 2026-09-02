import { defineField, defineType } from "sanity";

export const newsletterSubscriberSchema = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
    }),
  ],
  orderings: [{ title: "Newest First", name: "newest", by: [{ field: "subscribedAt", direction: "desc" }] }],
});
