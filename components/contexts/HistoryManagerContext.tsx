import { useRouter } from 'next/router';
import { useContext, createContext, useEffect, useState } from 'react';

const historyManagerContext = createContext<ReturnType<typeof useHistoryManager>>({
  history: [],
  canGoBack: () => false,
});

export function HistoryManagerProvider({ value, children }) {
  return <historyManagerContext.Provider value={value}>{children}</historyManagerContext.Provider>;
}

export const useHistory = () => useContext(historyManagerContext);

export function useHistoryManager() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      if (!shallow) {
        setHistory(prevState => [...prevState, url]);
      }
    };

    router.beforePopState(() => {
      setHistory(prevState => prevState.slice(0, -2));
      return true;
    });

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return { history, canGoBack: () => history.length > 1 };
}