import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export const TokenContext = createContext<{
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
}>({
  user: '',
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setUser(sessionStorage.getItem('user'));
  }, []);

  useEffect(() => {
    !pathname.includes('products') && sessionStorage.removeItem('page');
  }, [pathname]);

  return (
    <TokenContext.Provider value={{ user, setUser }}>
      <Header />
      <Outlet />
      <Footer />
    </TokenContext.Provider>
  );
}

export default App;
