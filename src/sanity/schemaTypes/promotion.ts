import { defineField, defineType } from 'sanity'

export const promotionSchema = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'activeDateRange',
      title: 'Active Date Range',
      type: 'object',
      fields: [
        { name: 'start', title: 'Start', type: 'datetime' },
        { name: 'end', title: 'End', type: 'datetime' },
      ],
    }),
    defineField({
      name: 'locations',
      title: 'Locations (empty = all)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
    }),
    defineField({ name: 'active', title: 'Active (manual override)', type: 'boolean', initialValue: true }),
  ],
})
