const getSessionStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};

const setSessionStorage = <T>(key: string, value: T): void => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const persist = { getSessionStorage, setSessionStorage, getLocalStorage, setLocalStorage };
