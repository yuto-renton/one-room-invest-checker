import { describe, expect, it } from 'vitest';
import { formatManYen, formatPercent, formatSignedManYen, formatYen } from './format';

describe('formatPercent', () => {
  it('小数点以下1桁でフォーマットされる（デフォルト）', () => {
    expect(formatPercent(5.678)).toBe('5.7%');
  });

  it('桁数を指定できる', () => {
    expect(formatPercent(5.678, 2)).toBe('5.68%');
    expect(formatPercent(5.678, 0)).toBe('6%');
  });

  it('0%を正しく表示する', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('マイナスを正しく表示する', () => {
    expect(formatPercent(-3.5)).toBe('-3.5%');
  });
});

describe('formatManYen', () => {
  it('万円単位でフォーマットされる', () => {
    expect(formatManYen(2300)).toBe('2,300万円');
  });

  it('小数点以下0桁がデフォルト', () => {
    expect(formatManYen(1234.5)).toBe('1,235万円');
  });

  it('桁数を指定できる', () => {
    expect(formatManYen(1234.5, 1)).toBe('1,234.5万円');
  });

  it('0万円を正しく表示する', () => {
    expect(formatManYen(0)).toBe('0万円');
  });
});

describe('formatYen', () => {
  it('円単位でフォーマットされる', () => {
    expect(formatYen(123456)).toBe('123,456円');
  });

  it('小数点以下を丸める', () => {
    expect(formatYen(99999.9)).toBe('100,000円');
  });

  it('0円を正しく表示する', () => {
    expect(formatYen(0)).toBe('0円');
  });
});

describe('formatSignedManYen', () => {
  it('プラスの場合に+符号がつく', () => {
    expect(formatSignedManYen(500)).toBe('+500万円');
  });

  it('マイナスの場合は-符号がつく', () => {
    expect(formatSignedManYen(-500)).toBe('-500万円');
  });

  it('0の場合は符号なし', () => {
    expect(formatSignedManYen(0)).toBe('0万円');
  });

  it('桁数を指定できる', () => {
    expect(formatSignedManYen(123.4, 1)).toBe('+123.4万円');
  });
});
