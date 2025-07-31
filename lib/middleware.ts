import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './auth'

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json(
          { error: 'No token provided' },
          { status: 401 }
        )
      }

      const user = await getUserFromToken(token)
      
      // Add user to request context
      const requestWithUser = {
        ...request,
        user
      }
      
      return handler(requestWithUser)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
} 