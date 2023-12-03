import { writable } from 'svelte/store';

export const token = writable();

export const isAuthenticated = () => {
	return !!token;
};

export const login = (newToken: string) => {
	token.set(newToken);
	localStorage.setItem('token', newToken);
};

export const logout = () => {
	token.set(null);
	localStorage.removeItem('token');
};
