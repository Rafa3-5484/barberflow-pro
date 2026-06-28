import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback?code=${code}`);
      const data = await response.json();

      if (data.accessToken) {
        const redirectUrl = new URL(next, origin);
        const res = NextResponse.redirect(redirectUrl);

        res.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        return res;
      }
    } catch {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
