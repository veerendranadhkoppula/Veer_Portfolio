import type { CollectionConfig } from 'payload'

export const ContactPartial: CollectionConfig = {
  slug: 'contact-partials',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'lastField', 'createdAt'],
    group: 'Portfolio',
    description: 'People who started filling the form but did not submit.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: () => true,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'sessionId', type: 'text', admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
      ],
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
    },
    {
      name: 'lastField',
      label: 'Last Field Touched',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Which field they filled last before leaving',
      },
    },
  ],
  timestamps: true,
}