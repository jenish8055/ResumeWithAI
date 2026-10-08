/**
 * Auth Service (Placeholder for future backend architecture)
 * Currently operates in local-first guest / device owner mode.
 */

export const authService = {
  getCurrentUser() {
    return {
      id: 'local_user',
      isAnonymous: true,
      name: 'ResumewithAI User',
      email: '',
      isLoggedIn: false,
    };
  },

  async loginWithEmail(email, password) {
    console.log('[Auth Placeholder] Logging in with email:', email);
    return { success: true, user: { email } };
  },

  async logout() {
    console.log('[Auth Placeholder] Logged out');
    return true;
  },
};
