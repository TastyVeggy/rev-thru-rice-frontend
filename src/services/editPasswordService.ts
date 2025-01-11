import { config } from '../config';

export const editPasswordService = async (
  password: string,
  confirmPassword: string
) => {
  const res = await fetch(`${config.apiUrl}/protected/users/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password,
      confirm_password: confirmPassword,
    }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorMessage = await res.text();
    if (errorMessage.includes('eqfield')) {
      throw new Error('Password and confirm password does not match');
    } else if (errorMessage.includes("'Password' failed on the 'min' tag")) {
      throw new Error('Password must be at least 6 characters');
    } else if (errorMessage.includes('User cannot be found')) {
      throw new Error('User not found');
    } else {
      throw new Error('Server failed :( Traffic may be high, please try again');
    }
  }
};
