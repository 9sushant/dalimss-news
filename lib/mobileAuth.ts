import { createHash, randomBytes, scrypt as rawScrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import type { NextApiRequest } from 'next';
import prisma from '@/lib/prisma';
const scrypt = promisify(rawScrypt);
export const hashToken = (s: string) => createHash('sha256').update(s).digest('hex');
export function publicReader(r: {id: string; username: string; displayName: string}) { return {id:r.id, username:r.username, displayName:r.displayName}; }
export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${key.toString('hex')}`;
}
export async function verifyPassword(password: string, value: string) {
  const [salt, hex] = value.split(':');
  const key = await scrypt(password, salt, 64) as Buffer;
  const expected = Buffer.from(hex, 'hex');
  return expected.length === key.length && timingSafeEqual(key, expected);
}
export async function createSession(readerId: string) {
  const token = randomBytes(32).toString('hex');
  await prisma.readerSession.create({data:{readerId, tokenHash: hashToken(token), expiresAt: new Date(Date.now()+30*86400000)}});
  return token;
}
export async function readerFor(req: NextApiRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const session = await prisma.readerSession.findUnique({where:{tokenHash:hashToken(auth.slice(7))},include:{reader:true}});
  return session && session.expiresAt.getTime()>Date.now() ? session.reader : null;
}
export async function rateLimit(req: NextApiRequest, action: string, max: number, identity?: string) {
  const ip = (req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown').toString();
  const bucket = Math.floor(Date.now()/3600000);
  const key = `${action}:${hashToken(identity || ip)}:${bucket}`;
  const item = await prisma.mobileRateLimit.upsert({where:{key},create:{key,count:1,expiresAt:new Date((bucket+2)*3600000)},update:{count:{increment:1}}});
  return item.count<=max;
}
