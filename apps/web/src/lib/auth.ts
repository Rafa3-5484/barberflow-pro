'use client';

import { createClient } from './supabase';
import api from './api';
import type { User } from '@serviceflow/shared';

export async function getSession(): Promise<{ user: User | null; session: unknown }> {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { user: null, session: null };
    }
    const response = await api.get('/auth/me');
    return { user: response.data.data, session: { accessToken: token } };
  } catch {
    return { user: null, session: null };
  }
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signIn(data: SignInData): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const response = await api.post('/auth/login', data);
  const { user, accessToken, refreshToken } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  return { user, accessToken, refreshToken };
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
}

export async function signUp(data: SignUpData): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const response = await api.post('/auth/register', data);
  const { user, accessToken, refreshToken } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  return { user, accessToken, refreshToken };
}

export async function signOut(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore supabase errors
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}
