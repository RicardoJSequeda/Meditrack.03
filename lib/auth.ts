import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

export interface JWTPayload {
  userId: string
  email: string
  name: string
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return jwt.verify(token, secret) as JWTPayload
}

// Get user from token
export async function getUserFromToken(token: string) {
  try {
    const payload = verifyToken(token)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single()

    if (error || !user) {
      throw new AuthError('User not found')
    }
    
    return user
  } catch (error) {
    throw new AuthError('Invalid token')
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    throw new AuthError('Invalid credentials')
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw new AuthError('Invalid credentials')
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    name: user.name
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      bloodType: user.bloodType,
      emergencyContact: user.emergencyContact,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      createdAt: user.createdAt,
    }
  }
}

// Register user
export async function registerUser(userData: {
  email: string
  password: string
  name: string
  phone?: string
  address?: string
  bloodType?: string
  emergencyContact?: string
  dateOfBirth?: Date
  gender?: string
}) {
  try {
    console.log('🔍 Verificando si el usuario existe...')
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      throw new AuthError('User already exists')
    }

    console.log('🔐 Hasheando contraseña...')
    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    console.log('👤 Creando usuario...')
    // Generate ID for the user
    const userId = uuidv4()
    
    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        id: userId,
        ...userData,
        password: hashedPassword
      })
      .select('id, email, name, phone, address, bloodType, emergencyContact, dateOfBirth, gender, createdAt')
      .single()

    if (createError) {
      console.error('❌ Error creando usuario:', createError)
      throw new AuthError(`Error creating user: ${createError.message}`)
    }

    console.log('✅ Usuario creado exitosamente:', user)

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    })

    return { token, user }
  } catch (error) {
    console.error('❌ Error en registerUser:', error)
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('Error creating user')
  }
} 