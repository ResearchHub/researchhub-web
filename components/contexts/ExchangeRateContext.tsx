import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactElement,
} from "react";
import numeral from "numeral";
import { fetchExchangeRate } from "~/config/fetch/exchangeRate";

type ContextType = {
  exchangeRate: number;
  rscToUSD: (rsc: number) => number;
  rscToUSDDisplay: (rsc: number) => string;
};

const ExchangeRateContext = createContext<ContextType>({
  exchangeRate: 0,
  rscToUSD: () => 0,
  rscToUSDDisplay: () => "",
});

export const useExchangeRate = () => useContext(ExchangeRateContext);

/**
 * Older components can't use hooks, so this is a wrapper to use the context.
 * You'd use it like this:
 * const Component = ({ rscToUSDDisplay }) => <div>{rscToUSDDisplay(100)}</div>;
 * export default withExchangeRate(Component);
 */
export function withExchangeRate(Component: any) {
  return function WrappedComponent(props: any): ReactElement {
    const { rscToUSDDisplay } = useExchangeRate();
    return <Component {...props} rscToUSDDisplay={rscToUSDDisplay} />;
  };
}

export const ExchangeRateContextProvider = ({ children }) => {
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    const asyncExchangeRate = async () => {
      const _exchangeRate = await fetchExchangeRate();
      setExchangeRate(_exchangeRate.results[0]?.real_rate);
    };

    asyncExchangeRate();
  }, []);

  const rscToUSD = (rsc: number) => {
    return rsc * exchangeRate;
  };

  const rscToUSDDisplay = (rsc: number) => {
    return numeral(rscToUSD(rsc)).format("$0,0.00");
  };

  return (
    <ExchangeRateContext.Provider
      value={{
        exchangeRate,
        rscToUSD,
        rscToUSDDisplay,
      }}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
};

export default ExchangeRateContext;
