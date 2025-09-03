/**
 * Set admin custom claims for a user.
 * Run with: node admin-claims.js user_uid true
 * Requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON.
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';

async function main(){
  const [,, uid, value] = process.argv;
  if(!uid){ console.error('Usage: node admin-claims.js <uid> <true|false>'); process.exit(1); }
  const adminValue = String(value).toLowerCase() === 'true';

  // Initialize Admin SDK (Application Default Credentials or explicit service account)
  if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Using default credentials if available.');
  }
  initializeApp();

  await getAuth().setCustomUserClaims(uid, { admin: adminValue });
  const user = await getAuth().getUser(uid);
  console.log(`Set admin=${adminValue} for`, user.uid, user.email || '');
  console.log('Claims now:', user.customClaims || {});
}

main().catch(err=>{ console.error(err); process.exit(1); });
