import { IncomeRange } from '../types';

export const INCOME_RANGE_OPTIONS: { value: IncomeRange; label: string; marginalTaxRate: number }[] = [
  { value: 'under500', label: '〜500万円', marginalTaxRate: 0.20 },
  { value: '500to700', label: '500〜700万円', marginalTaxRate: 0.30 },
  { value: '700to900', label: '700〜900万円', marginalTaxRate: 0.33 },
  { value: '900to1200', label: '900〜1200万円', marginalTaxRate: 0.43 },
  { value: 'over1200', label: '1200万円〜', marginalTaxRate: 0.50 },
];

export function getMarginalTaxRate(incomeRange: IncomeRange): number {
  return INCOME_RANGE_OPTIONS.find((o) => o.value === incomeRange)!.marginalTaxRate;
}
