import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
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

  useEffect(() => {
    setUser(sessionStorage.getItem('user'));
  }, []);

  return (
    <TokenContext.Provider value={{ user, setUser }}>
      <Header />
      <Outlet />
      <Footer />
    </TokenContext.Provider>
  );
}

export default App;
