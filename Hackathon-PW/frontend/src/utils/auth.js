/**
 * Auth utility functions
 */

export const getToken = () => {
  return localStorage.getItem('algotix_token');
};

export const getUser = () => {
  const userStr = localStorage.getItem('algotix_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem('algotix_token');
  localStorage.removeItem('algotix_user');
};

export const setAuth = (token, user) => {
  localStorage.setItem('algotix_token', token);
  localStorage.setItem('algotix_user', JSON.stringify(user));
};
