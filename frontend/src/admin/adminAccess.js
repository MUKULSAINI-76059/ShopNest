export const isReadOnlyAdmin = (user) =>
  user?.role === 'admin' && user.email?.toLowerCase() === 'admin321@gmail.com';
