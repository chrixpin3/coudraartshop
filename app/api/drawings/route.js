import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    let query = {}
    if (featured === 'true') {
      query.featured = true
    }

    const drawings = await db.collection('drawings')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const serialized = drawings.map(d => ({
      ...d,
      _id: d._id.toString(),
      id: d._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const db = await getDb()
    const body = await request.json()

    const drawing = {
      title: body.title,
      artist: body.artist,
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      category: body.category || 'Uncategorized',
      dimensions: body.dimensions || 'N/A',
      year: body.year || 'N/A',
      medium: body.medium || 'N/A',
      stock: parseInt(body.stock) || 0,
      featured: body.featured || false,
      image: body.image || null,
      imagePlaceholder: body.image ? null : (body.imagePlaceholder || '🎨'),
      media: body.media || [],
      rating: 0,
      reviews: 0,
      inStock: (parseInt(body.stock) || 0) > 0,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection('drawings').insertOne(drawing)

    return NextResponse.json({
      ...drawing,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
