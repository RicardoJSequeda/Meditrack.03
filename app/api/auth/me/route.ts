import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'

async function handler(request: NextRequest & { user: any }) {
  try {
    return NextResponse.json({
      success: true,
      data: request.user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler) 