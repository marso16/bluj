import { defineField, defineType } from 'sanity'

export const locationSchema = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Location Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'address', title: 'Address', type: 'string', validation: r => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', title: 'Day', type: 'string' },
          { name: 'open', title: 'Opens At (HH:MM 24h)', type: 'string' },
          { name: 'close', title: 'Closes At (HH:MM 24h)', type: 'string' },
          { name: 'closed', title: 'Closed all day', type: 'boolean' },
        ],
      }],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Deli', value: 'Deli' },
          { title: "Dunkin'", value: "Dunkin'" },
          { title: 'Auto Repair', value: 'Auto Repair' },
          { title: 'Chicken on the Go', value: 'Chicken on the Go' },
          { title: 'ATM', value: 'ATM' },
          { title: 'Car Wash', value: 'Car Wash' },
        ],
      },
    }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
  ],
})
