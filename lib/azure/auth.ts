// Azure AD B2C Authentication helpers for Crowe Mycology
// This replaces Supabase Auth

import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.AZURE_AUTH_SECRET || "crowe-mycology-secret-key")

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  is_admin?: boolean
}

export interface Session {
  user: User
  access_token: string
  expires_at: number
}

// Get current user from session cookie
export async function getUser(): Promise<{ data: { user: User | null }; error: Error | null }> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("crowe-session")

    if (!sessionCookie?.value) {
      return { data: { user: null }, error: null }
    }

    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)

    return {
      data: {
        user: {
          id: payload.sub as string,
          email: payload.email as string,
          name: payload.name as string | undefined,
          avatar_url: payload.avatar_url as string | undefined,
          is_admin: payload.is_admin as boolean | undefined,
        },
      },
      error: null,
    }
  } catch (error) {
    return { data: { user: null }, error: error as Error }
  }
}

// Create a session token
export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  return token
}

// Sign in with email and password
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }> {
  try {
    // Import database functions
    const { selectSingle } = await import("./database")
    const bcrypt = await import("bcryptjs")

    // Find user by email
    const { data: user, error } = await selectSingle<{
      id: string
      email: string
      password_hash: string
      name?: string
      avatar_url?: string
      is_admin?: boolean
    }>("users", "*", "email = @email", { email })

    if (error || !user) {
      return { data: { user: null, session: null }, error: new Error("Invalid email or password") }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return { data: { user: null, session: null }, error: new Error("Invalid email or password") }
    }

    const sessionUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      is_admin: user.is_admin,
    }

    const token = await createSession(sessionUser)

    return {
      data: {
        user: sessionUser,
        session: {
          user: sessionUser,
          access_token: token,
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
      },
      error: null,
    }
  } catch (error) {
    return { data: { user: null, session: null }, error: error as Error }
  }
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  metadata?: { name?: string },
): Promise<{ data: { user: User | null }; error: Error | null }> {
  try {
    const { insert } = await import("./database")
    const bcrypt = await import("bcryptjs")
    const { v4: uuidv4 } = await import("uuid")

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await insert<{
      id: string
      email: string
      name?: string
    }>("users", {
      id: uuidv4(),
      email,
      password_hash,
      name: metadata?.name,
      created_at: new Date().toISOString(),
    })

    if (error) {
      return { data: { user: null }, error }
    }

    return {
      data: {
        user: user
          ? {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          : null,
      },
      error: null,
    }
  } catch (error) {
    return { data: { user: null }, error: error as Error }
  }
}

// Sign out
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("crowe-session")
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Auth state change listener (client-side only)
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  // This would be implemented with a client-side auth state manager
  // For now, return a mock subscription
  return {
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  }
}
