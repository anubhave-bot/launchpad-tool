import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from './store';
import ProgressBar from './components/ProgressBar';
import Step0_ProjectSetup from './steps/Step0_ProjectSetup';
import Step1_UserResearch from './steps/Step1_UserResearch';
import Step2_PrimaryUserGroups from './steps/Step2_PrimaryUserGroups';
import Step3_CoreProblems from './steps/Step3_CoreProblems';
import Step4_ProductStrategy from './steps/Step4_ProductStrategy';
import Step5_Review from './steps/Step5_Review';

const styles = {
  layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, maxWidth: '860px', margin: '0 auto', width: '100%', padding: '28px 20px 60px' },
};

export default function App() {
  const [step, setStep] = useState(0);
  const [state, setStateRaw] = useState(() => loadState());

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const saved = saveState(next);
      return saved;
    });
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setStateRaw(prev => saveState(prev));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  function goNext() {
    setStep(s => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goBack() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goTo(s) {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const sharedProps = { state, setState, onNext: goNext, onBack: goBack };

  return (
    <div style={styles.layout}>
      <ProgressBar currentStep={step} lastSaved={state.meta.lastSaved} onNavigate={goTo} />
      <main style={styles.main}>
        {step === 0 && <Step0_ProjectSetup {...sharedProps} onBack={null} />}
        {step === 1 && <Step1_UserResearch {...sharedProps} />}
        {step === 2 && <Step2_PrimaryUserGroups {...sharedProps} />}
        {step === 3 && <Step3_CoreProblems {...sharedProps} />}
        {step === 4 && <Step4_ProductStrategy {...sharedProps} />}
        {step === 5 && <Step5_Review state={state} onBack={goBack} />}
      </main>
    </div>
  );
}
