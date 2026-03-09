import { useMemo } from 'react';
import Panel from '../components/Panel';
import { SCENARIOS } from '../constants/scenarios';
import SimulationForm from '../modules/simulation/SimulationForm';
import SimulationResult from '../modules/simulation/SimulationResult';
import ScenarioPresetSwitch from '../modules/simulation/ScenarioPresetSwitch';
import { ScenarioKey, SimulationInput } from '../types';
import { runSimulation } from '../utils/simulation';

type Props = {
  value: SimulationInput;
  onChange: (next: SimulationInput) => void;
  activeScenario: ScenarioKey;
  onApplyScenario: (key: ScenarioKey) => void;
};

export default function SimulationPage({ value, onChange, activeScenario, onApplyScenario }: Props) {
  const result = useMemo(() => runSimulation(value), [value]);
  const scenario = SCENARIOS.find((item) => item.key === activeScenario)!;

  return (
    <div className="grid gap-5 lg:gap-6">
      <Panel title="シナリオのたたき台" subtitle="シナリオは初期値を入れるためのショートカットです。選んだあとに数字を直接変えられます。">
        <div className="grid gap-4">
          <ScenarioPresetSwitch activeScenario={activeScenario} onSelect={onApplyScenario} />
          <div className="rounded-2xl bg-mist p-4 text-sm leading-7 text-slate-600">
            現在のシナリオ: <span className="font-semibold text-ink">{scenario.label}</span> / {scenario.description}
          </div>
          <div className="text-xs leading-6 text-slate-400">
            ※ シナリオの数値はMVP用のサンプル値です。悲観シナリオの金利（2.8%）・空室率（15%）はやや控えめな設定で、
            利上げが続いた場合や郊外・築古物件では金利3〜4%・空室率20〜25%になるケースもあります。
            実際の物件・融資条件に合わせて数値を直接調整してご利用ください。
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-12 xl:items-start xl:gap-6">
        <div className="xl:col-span-5">
          <SimulationForm value={value} onChange={onChange} />
        </div>
        <div className="xl:col-span-7">
          <SimulationResult result={result} />
        </div>
      </div>
    </div>
  );
}
