import { create } from 'zustand';
// interface PricesDgg {
//   data: {
//     dggPriceUsd: string;
//   };
//   result: boolean;
//   message: string;
// }

interface PricesDggState {
  // dggPriceUsd: string;
  fetchDataDrinks: () => Promise<void>;
}

export const usePricesDggDataStore = create<PricesDggState>(() => ({
  dggPriceUsd: '',
  fetchDataDrinks: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}drinks/`);
      if (!response.ok) throw new Error('Failed to fetch data');
      // const result = (await response.json()) as PricesDgg;
      // set({
      //   dggPriceUsd: result?.data?.dggPriceUsd,
      // });
    } catch (error: unknown) {
      console.error(error);
    }
  },
}));
