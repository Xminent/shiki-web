import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const token = writable(browser ? localStorage.getItem('token') : null);

export const login = (newToken: string) => {
	token.set(newToken);
	localStorage.setItem('token', newToken);
};

export const logout = () => {
	token.set(null);
	localStorage.removeItem('token');
};
