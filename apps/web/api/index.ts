import { createServer, proxy } from '@vercel/node';

export default async function handler(req: any, res: any) {
  const { createNestApp } = await import('./nest-app');
  const app = await createNestApp();
  await app.init();
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
}
