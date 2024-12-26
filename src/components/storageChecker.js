import Cookies from 'js-cookie';

export const checkAuth = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export const saveCurrentUrl = () => {
  const currentPath = window.location.pathname + window.location.search;
  Cookies.set('redirectUrl', currentPath, { expires: 1 }); // Expires in 1 day
};

