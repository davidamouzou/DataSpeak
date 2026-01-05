import { useState, useEffect } from 'react';

const loadingStates = [
  { icon: '🔍', text: 'Analyse du schéma...', progress: 25 },
  { icon: '⚙️', text: 'Génération de la requête SQL...', progress: 50 },
  { icon: '🚀', text: 'Exécution en cours...', progress: 75 },
  { icon: '✓', text: 'Résultats prêts !', progress: 100 },
];

export function LoadingMessage() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < loadingStates.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const state = loadingStates[currentStep];

  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-3xl bg-card rounded-xl px-4 py-3 shadow-md border border-border mr-12">
        <div className="flex items-center gap-2 mb-3">
          <span>🤖</span>
          <span className="text-muted-foreground">Assistant</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="animate-pulse-subtle">{state.icon}</span>
            <span className="text-foreground">{state.text}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2">
            {loadingStates.map((_, index) => (
              <div
                key={index}
                className={`
                  h-1 flex-1 rounded-full transition-all duration-300
                  ${index <= currentStep ? 'bg-primary' : 'bg-muted'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}