import { describe, expect, it } from 'vitest';
import { PropertyInput } from '../types';
import { calculateScore } from './calculations';

const BASE_GOOD: PropertyInput = {
  area: 'tsurumi',
  priceManYen: 1800,
  monthlyRent: 85000,
  managementFee: 8000,
  repairReserve: 4000,
  buildingAge: 5,
  areaSqm: 25,
  walkMinutes: 5,
};

describe('calculateScore', () => {
  describe('利回り', () => {
    it('表面利回り5%以上のとき利回りペナルティなし', () => {
      const result = calculateScore(BASE_GOOD);
      // 85000*12 / 18000000 ≈ 5.67%
      expect(result.grossYield).toBeGreaterThan(5);
      expect(result.reasons).not.toContain('利回りが低めです');
    });

    it('表面利回り4%未満のとき強ペナルティ（-25点）', () => {
      const input: PropertyInput = { ...BASE_GOOD, priceManYen: 3000, monthlyRent: 85000 };
      // 85000*12 / 30000000 ≈ 3.4%
      const result = calculateScore(input);
      expect(result.grossYield).toBeLessThan(4);
      expect(result.reasons).toContain('利回りが低めです');
    });

    it('表面利回り4〜5%のとき軽ペナルティ', () => {
      const input: PropertyInput = { ...BASE_GOOD, priceManYen: 2200, monthlyRent: 85000 };
      // 85000*12 / 22000000 ≈ 4.64%
      const result = calculateScore(input);
      expect(result.grossYield).toBeGreaterThanOrEqual(4);
      expect(result.grossYield).toBeLessThan(5);
      expect(result.reasons).toContain('利回りは平均的ですが、余裕は大きくありません');
    });
  });

  describe('価格・相場比較', () => {
    it('相場比+20%超のとき強ペナルティ', () => {
      // tsurumi benchmark: averagePricePerSqm = 84 万円/㎡
      // 20㎡で +25%割高 → priceManYen = 84 * 20 * 1.25 = 2100
      const input: PropertyInput = { ...BASE_GOOD, priceManYen: 2200, areaSqm: 20 };
      // pricePerSqm = 110, benchmark 84 → gap ≈ 31%
      const result = calculateScore(input);
      expect(result.reasons).toContain('エリア平均よりかなり割高です');
    });

    it('相場比+10〜20%のとき軽ペナルティ', () => {
      // tsurumi benchmark = 88万円/㎡
      // +15% → pricePerSqm = 88 * 1.15 = 101.2 → priceManYen = 101.2 * 25 = 2530
      const input: PropertyInput = { ...BASE_GOOD, priceManYen: 2530, areaSqm: 25 };
      const result = calculateScore(input);
      expect(result.priceGapPercent).toBeGreaterThanOrEqual(10);
      expect(result.priceGapPercent).toBeLessThan(20);
      expect(result.reasons).toContain('エリア平均よりやや割高です');
    });
  });

  describe('築年数', () => {
    it('築25年以上のとき強ペナルティ', () => {
      const input: PropertyInput = { ...BASE_GOOD, buildingAge: 30 };
      const result = calculateScore(input);
      expect(result.reasons).toContain('築年数が進んでいます');
    });

    it('築15〜24年のとき軽ペナルティ', () => {
      const input: PropertyInput = { ...BASE_GOOD, buildingAge: 18 };
      const result = calculateScore(input);
      expect(result.reasons).toContain('築年数はやや進んでいます');
    });

    it('築14年以下のとき築年数ペナルティなし', () => {
      const input: PropertyInput = { ...BASE_GOOD, buildingAge: 10 };
      const result = calculateScore(input);
      expect(result.reasons).not.toContain('築年数が進んでいます');
      expect(result.reasons).not.toContain('築年数はやや進んでいます');
    });
  });

  describe('ランニングコスト', () => {
    it('ランニングコスト比率20%以上のとき重いペナルティ', () => {
      const input: PropertyInput = {
        ...BASE_GOOD,
        monthlyRent: 50000,
        managementFee: 7000,
        repairReserve: 5000,
      };
      // (7000+5000)/50000 = 24%
      const result = calculateScore(input);
      expect(result.reasons).toContain('ランニングコストが重めです');
    });

    it('ランニングコスト比率20%未満のときペナルティなし', () => {
      const input: PropertyInput = {
        ...BASE_GOOD,
        monthlyRent: 80000,
        managementFee: 8000,
        repairReserve: 4000,
      };
      // (8000+4000)/80000 = 15%
      const result = calculateScore(input);
      expect(result.reasons).not.toContain('ランニングコストが重めです');
    });
  });

  describe('駅距離・面積', () => {
    it('徒歩11分以上のときペナルティ', () => {
      const input: PropertyInput = { ...BASE_GOOD, walkMinutes: 15 };
      const result = calculateScore(input);
      expect(result.reasons).toContain('駅からやや遠めです');
    });

    it('徒歩10分以内のときペナルティなし', () => {
      const input: PropertyInput = { ...BASE_GOOD, walkMinutes: 10 };
      const result = calculateScore(input);
      expect(result.reasons).not.toContain('駅からやや遠めです');
    });

    it('面積20㎡未満のときペナルティ', () => {
      const input: PropertyInput = { ...BASE_GOOD, areaSqm: 18 };
      const result = calculateScore(input);
      expect(result.reasons).toContain('面積がやや小さめです');
    });

    it('面積20㎡以上のときペナルティなし', () => {
      const input: PropertyInput = { ...BASE_GOOD, areaSqm: 20 };
      const result = calculateScore(input);
      expect(result.reasons).not.toContain('面積がやや小さめです');
    });
  });

  describe('スコアとラベル', () => {
    it('スコアは0以上100以下', () => {
      const result = calculateScore(BASE_GOOD);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('全ペナルティ重複でもスコアは0未満にならない', () => {
      // 最大ペナルティ合計 = 25+25+10+10+10+10 = 90 → 最低スコアは10
      const worst: PropertyInput = {
        area: 'tsurumi',
        priceManYen: 5000,
        monthlyRent: 30000,
        managementFee: 10000,
        repairReserve: 5000,
        buildingAge: 40,
        areaSqm: 15,
        walkMinutes: 20,
      };
      const result = calculateScore(worst);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBe(10);
    });

    it('スコア80以上なら良好', () => {
      const result = calculateScore(BASE_GOOD);
      if (result.score >= 80) {
        expect(result.label).toBe('良好');
      }
    });

    it('スコア40未満なら高リスク', () => {
      const worst: PropertyInput = {
        area: 'tsurumi',
        priceManYen: 5000,
        monthlyRent: 30000,
        managementFee: 10000,
        repairReserve: 5000,
        buildingAge: 40,
        areaSqm: 15,
        walkMinutes: 20,
      };
      const result = calculateScore(worst);
      expect(result.label).toBe('高リスク');
    });
  });

  describe('利回り計算', () => {
    it('表面利回りの計算式が正しい', () => {
      const result = calculateScore(BASE_GOOD);
      const expected = ((BASE_GOOD.monthlyRent * 12) / (BASE_GOOD.priceManYen * 10000)) * 100;
      expect(result.grossYield).toBeCloseTo(expected, 5);
    });

    it('実質利回りは管理費・修繕積立を差し引いた値', () => {
      const result = calculateScore(BASE_GOOD);
      const expected =
        (((BASE_GOOD.monthlyRent - BASE_GOOD.managementFee - BASE_GOOD.repairReserve) * 12) /
          (BASE_GOOD.priceManYen * 10000)) *
        100;
      expect(result.netYield).toBeCloseTo(expected, 5);
    });
  });
});
