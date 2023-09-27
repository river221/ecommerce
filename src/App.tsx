import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export const AuthContext = createContext<{
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
}>({
  user: '',
  setUser: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(sessionStorage.getItem('user'));
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    !pathname.includes('products') && sessionStorage.removeItem('page');
  }, [pathname]);

  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}

export default App;
