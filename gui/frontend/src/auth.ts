export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
    localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
    localStorage.removeItem('auth_token');
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        clearAuthToken();
        window.dispatchEvent(new Event('auth_error'));
    }
    return response;
};
