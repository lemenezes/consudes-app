type FrankfurterRateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type ExchangeRateResult = {
  rate: number;
  updatedAt: string;
};

export async function getUsdToBrlRate(): Promise<ExchangeRateResult> {
  const response = await fetch(
    "https://api.frankfurter.dev/v2/providers/bcb/rate/usd/brl"
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar a cotação USD/BRL.");
  }

  const data: FrankfurterRateResponse = await response.json();

  if (!data.rate || Number.isNaN(data.rate)) {
    throw new Error("Cotação USD/BRL inválida.");
  }

  return {
    rate: data.rate,
    updatedAt: data.date
  };
}
