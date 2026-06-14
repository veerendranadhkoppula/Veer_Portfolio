import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { sessionId, field, allFields } = await req.json()

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'contact-partials',
      where: { sessionId: { equals: sessionId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const prev = existing.docs[0]

      await payload.update({
        collection: 'contact-partials',
        id: prev.id,
        data: {
          name: allFields.name || prev.name || '',
          email: allFields.email || prev.email || '',
          phone: allFields.phone || prev.phone || '',
          message: allFields.message || prev.message || '',
          lastField: field,
        },
      })
    } else {
      await payload.create({
        collection: 'contact-partials',
        data: {
          sessionId,
          ...allFields,
          lastField: field,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('❌ Contact partial error:', err)
    return NextResponse.json({ ok: false })
  }
}