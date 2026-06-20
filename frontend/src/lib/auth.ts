import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-barberflow-2024'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-barberflow-2024'

export { bcrypt }

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateTokens(payload: { sub: string; email: string; role: string; barbershopId: string }) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string; barbershopId: string }
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string; email: string; role: string; barbershopId: string }
  } catch {
    return null
  }
}

export function getUserFromRequest(req: Request | NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return verifyAccessToken(authHeader.slice(7))
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function error(message: string, status = 400) {
  return json({ error: message }, status)
}
