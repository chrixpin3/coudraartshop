import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const db = await getDb()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid drawing ID' }, { status: 400 })
    }

    const drawing = await db.collection('drawings').findOne({ _id: new ObjectId(id) })
    if (!drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...drawing,
      _id: drawing._id.toString(),
      id: drawing._id.toString(),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const db = await getDb()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid drawing ID' }, { status: 400 })
    }

    const body = await request.json()

    const updateFields = {
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
      inStock: (parseInt(body.stock) || 0) > 0,
      updatedAt: new Date().toISOString(),
    }

    if (body.image !== undefined) {
      updateFields.image = body.image
      updateFields.imagePlaceholder = body.image ? null : (body.imagePlaceholder || '🎨')
    }

    if (body.media !== undefined) {
      updateFields.media = body.media
    }

    await db.collection('drawings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )

    const updated = await db.collection('drawings').findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      ...updated,
      _id: updated._id.toString(),
      id: updated._id.toString(),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid drawing ID' }, { status: 400 })
    }

    const result = await db.collection('drawings').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
