import type { CollectionConfig } from 'payload'

const sendBrevo = async (payload: {
  sender: { email: string; name: string }
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
}) => {
  const apiKey = (process.env.BREVO_API_KEY || '').trim()
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not set')
    return
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 10000)
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      const text = await res.text().catch(() => '<no-body>')
      if (!res.ok) throw new Error(`Brevo ${res.status}: ${text}`)
      console.log(`✅ Brevo email sent (attempt ${attempt})`)
      return
    } catch (err: any) {
      clearTimeout(timer)
      console.error(`❌ Brevo attempt ${attempt} failed:`, err?.message)
      if (attempt === 2) throw err
      await new Promise((r) => setTimeout(r, 400))
    }
  }
}

export const ContactForm: CollectionConfig = {
  slug: 'contact-forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'status', 'createdAt'],
    group: 'Portfolio',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Phone Number', type: 'text' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Read', value: 'read' },
            { label: 'Replied', value: 'replied' },
          ],
          admin: {
            description: 'Track your response status',
          },
        },
      ],
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
    },
  ],
  timestamps: true,

  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const verifiedSender = process.env.VERIFIED_SENDER || process.env.ADMIN_EMAIL
        const adminEmail = process.env.ADMIN_EMAIL

        if (!verifiedSender) {
          console.error('❌ VERIFIED_SENDER or ADMIN_EMAIL not set')
          return
        }

        const submittedAt = doc.createdAt || new Date().toISOString()

        if (adminEmail) {
          sendBrevo({
            sender: { email: verifiedSender, name: 'Veer Portfolio' },
            to: [{ email: adminEmail, name: 'Veerendranadh' }],
            subject: `📩 New Contact — ${doc.name}`,
            htmlContent: `
              <h2 style="color:#333;font-family:sans-serif">New Portfolio Contact</h2>
              <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
                <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${doc.name}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${doc.email}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${doc.phone || '—'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${doc.message || '—'}</td></tr>
              </table>
              <p style="color:#999;font-size:12px;font-family:sans-serif">Submitted on ${submittedAt}</p>
            `,
          }).catch((err) => console.error('❌ Failed to send admin email:', err))
        }
      },
    ],
  },
}