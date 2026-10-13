'use client';

import { useState } from 'react';
import AiKonsultForm from '@/components/AiKonsultForm';

const NEEDS = [
  { id: 'automatisera', label: 'Automatisera arbetet', text: 'Effektivisera processer och spara tid med AI.' },
  { id: 'bygga', label: 'Bygga en AI-lösning', text: 'Utveckla en skräddarsydd AI-lösning för er verksamhet.' },
  { id: 'strategi', label: 'Strategi och rådgivning', text: 'Få stöd i strategi, vägval och prioriteringar.' },
  { id: 'utbilda', label: 'Utbilda teamet', text: 'Kompetenshöjning och praktisk AI-utbildning.' },
  { id: 'osaker', label: 'Jag är osäker, hjälp mig välja', text: 'Beskriv kort er situation, så hjälper vi er vidare.' },
];

const SCOPES = [
  { id: 'test', label: 'Ett avgränsat test', text: 'En pilot eller ett första steg.' },
  { id: 'storre', label: 'Ett större projekt', text: 'Ett uppdrag med flera delar över tid.' },
  { id: 'vet-ej', label: 'Vet inte än', text: 'Vi behöver hjälp att bedöma det.' },
];

export default function AiKonsultWizard({ city = 'Stockholm' }: { city?: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [need, setNeed] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);

  const needLabel = NEEDS.find((n) => n.id === need)?.label ?? '';
  const scopeLabel = SCOPES.find((s) => s.id === scope)?.label ?? '';
  const presetNeed = need ? `${needLabel}. ${scopeLabel ? `Omfattning: ${scopeLabel.toLowerCase()}.` : ''}` : '';

  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid lg:grid-cols-[1fr_1.2fr]">
        {/* Vänster: förklaring */}
        <div className="bg-gradient-to-br from-indigo-700 to-violet-800 p-8 text-white sm:p-10">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">Vilken AI-konsult passar er?</h2>
          <p className="mt-3 text-white/85">Berätta vad ni vill uppnå, så hjälper vi er att hitta rätt kompetens.</p>
          <ol className="mt-8 space-y-6">
            <li className="flex gap-4"><span className="font-semibold">1</span><div><p className="font-semibold">Beskriv behovet</p><p className="text-sm text-white/75">Välj det som passar bäst för er.</p></div></li>
            <li className="flex gap-4"><span className="font-semibold">2</span><div><p className="font-semibold">Ange omfattningen</p><p className="text-sm text-white/75">Ett test eller ett större projekt.</p></div></li>
            <li className="flex gap-4"><span className="font-semibold">3</span><div><p className="font-semibold">Vi förmedlar kontakten</p><p className="text-sm text-white/75">Ni får svar på e-posten ni angav.</p></div></li>
          </ol>
        </div>

        {/* Höger: steg */}
        <div className="p-8 sm:p-10">
          <p className="text-xs font-medium text-fg/60">Steg {step} av 3</p>

          {step === 1 && (
            <>
              <h3 className="mt-2 text-2xl font-semibold text-fg">Vad vill ni ha hjälp med?</h3>
              <p className="mt-1 text-sm text-fg/70">Välj det som ligger närmast. Ni kan beskriva mer i nästa steg.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {NEEDS.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNeed(n.id)}
                    aria-pressed={need === n.id}
                    className={`rounded-xl border p-4 text-left transition ${need === n.id ? 'border-indigo-600 bg-indigo-50' : 'border-black/10 hover:border-indigo-300'} sm:col-span-1 ${n.id === 'osaker' ? 'sm:col-span-2' : ''}`}
                  >
                    <p className="font-semibold text-fg">{n.label}</p>
                    <p className="mt-1 text-sm text-fg/70">{n.text}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!need}
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
              >
                Fortsätt →
              </button>
              <p className="mt-3 text-center text-xs text-fg/60">Inga kontaktuppgifter behövs i det här steget.</p>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="mt-2 text-2xl font-semibold text-fg">Hur stort är det här?</h3>
              <p className="mt-1 text-sm text-fg/70">Det hjälper oss att förstå vilken typ av konsult som passar.</p>
              <div className="mt-6 grid gap-3">
                {SCOPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScope(s.id)}
                    aria-pressed={scope === s.id}
                    className={`rounded-xl border p-4 text-left transition ${scope === s.id ? 'border-indigo-600 bg-indigo-50' : 'border-black/10 hover:border-indigo-300'}`}
                  >
                    <p className="font-semibold text-fg">{s.label}</p>
                    <p className="mt-1 text-sm text-fg/70">{s.text}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-lg px-4 py-3 font-medium text-indigo-600 hover:underline">← Tillbaka</button>
                <button
                  type="button"
                  disabled={!scope}
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
                >
                  Fortsätt →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="-mx-2">
              <button type="button" onClick={() => setStep(2)} className="mb-4 px-2 text-sm font-medium text-indigo-600 hover:underline">← Tillbaka</button>
              <AiKonsultForm city={city} presetNeed={presetNeed} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
