import { defineField, defineType } from 'sanity'

export const jobApplicationSchema = defineType({
  name: 'jobApplication',
  title: 'Job Application',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'preferredLocation', title: 'Preferred Location', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'message', title: 'Message / Cover Note', type: 'text' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'New', value: 'new' }, { title: 'Reviewed', value: 'reviewed' }, { title: 'Contacted', value: 'contacted' }] },
      initialValue: 'new',
    }),
  ],
})
