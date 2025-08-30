/** Firebase Auth helpers (email/password) */
export async function initAuth(app){
  const [{ getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js')
  ])
  const auth = getAuth(app)
  // Expose globally for settings page usage
  window.PM_auth = { auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut }
  return auth
}
