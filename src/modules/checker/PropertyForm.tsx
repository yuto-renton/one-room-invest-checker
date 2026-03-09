import { AREA_BENCHMARKS, AREA_OPTIONS } from '../../constants/areas';
import Panel from '../../components/Panel';
import { PropertyInput } from '../../types';

const fieldClassName =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-softblue';

type NumericFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  hint?: string;
};

function NumericField({ label, value, onChange, suffix, hint }: NumericFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          className={`${fieldClassName} pr-16`}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>
      </div>
      {hint && <span className="text-xs leading-5 text-slate-400">{hint}</span>}
    </label>
  );
}

type Props = {
  value: PropertyInput;
  onChange: (next: PropertyInput) => void;
};

export default function PropertyForm({ value, onChange }: Props) {
  const update = <K extends keyof PropertyInput>(key: K, nextValue: PropertyInput[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const benchmark = AREA_BENCHMARKS[value.area];

  return (
    <Panel title="物件条件" subtitle="初期値をたたき台にして、数字を直接入力できます。">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-600">エリア</span>
          <select
            className={fieldClassName}
            value={value.area}
            onChange={(e) => update('area', e.target.value as PropertyInput['area'])}
          >
            {AREA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-xs leading-5 text-slate-500">
            参考相場: {benchmark.averagePricePerSqm}万円/㎡ / 参考表面利回り {benchmark.averageGrossYield}%
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumericField
            label="物件価格" value={value.priceManYen}
            onChange={(v) => update('priceManYen', v)} suffix="万円"
          />
          <NumericField
            label="月額家賃" value={value.monthlyRent}
            onChange={(v) => update('monthlyRent', v)} suffix="円"
            hint="現在の実際の賃料を入力"
          />
          <NumericField
            label="管理費" value={value.managementFee}
            onChange={(v) => update('managementFee', v)} suffix="円/月"
            hint="管理組合への月額費用"
          />
          <NumericField
            label="修繕積立金" value={value.repairReserve}
            onChange={(v) => update('repairReserve', v)} suffix="円/月"
            hint="長期修繕計画に基づく月額費用"
          />
          <NumericField
            label="築年数" value={value.buildingAge}
            onChange={(v) => update('buildingAge', v)} suffix="年"
          />
          <NumericField
            label="専有面積" value={value.areaSqm}
            onChange={(v) => update('areaSqm', v)} suffix="㎡"
            hint="登記面積を入力"
          />
          <NumericField
            label="駅徒歩" value={value.walkMinutes}
            onChange={(v) => update('walkMinutes', v)} suffix="分"
            hint="最寄駅からの徒歩分数"
          />
        </div>
      </div>
    </Panel>
  );
}
