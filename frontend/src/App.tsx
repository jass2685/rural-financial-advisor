import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CalculatorSection } from './components/CalculatorSection';
import { ResultsSection } from './components/ResultsSection';
import { AdvisorySection } from './components/AdvisorySection';
import { Footer } from './components/Footer';
import { LoanFormInput, PlanEvaluationResult, AiAdvisoryResult } from './types';
import { createPlan, generateAdvisory } from './services/api';

export function App() {
  const [planResult, setPlanResult] = useState<PlanEvaluationResult | null>(null);
  const [advisoryResult, setAdvisoryResult] = useState<AiAdvisoryResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Section 1 CTA -> Scroll to Section 2 Calculator
  const handleHeroCta = () => {
    scrollToSection('calculator-section');
  };

  // Section 2 Submit -> Evaluate Eligibility & Reveal Section 3
  const handleEvaluatePlan = async (formData: LoanFormInput) => {
    setIsEvaluating(true);
    try {
      const response = await createPlan(formData);
      setPlanResult(response.result);
      setIsLiveApi(response.isLiveApi);
      // Reset subsequent AI step if recalculated
      setAdvisoryResult(null);
      scrollToSection('results-section');
    } catch (err) {
      console.error('Error evaluating plan:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Section 3 Action -> Generate AI Strategy & Reveal Section 4
  const handleGenerateAiStrategy = async () => {
    if (!planResult) return;
    setIsGeneratingAi(true);
    try {
      const response = await generateAdvisory(planResult.id, {
        input: planResult.userInput,
        planResult: planResult,
      });
      setAdvisoryResult(response.advisory);
      if (response.isLiveApi) {
        setIsLiveApi(true);
      }
      scrollToSection('advisory-section');
    } catch (err) {
      console.error('Error generating AI strategy:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Reset to run another evaluation
  const handleReset = () => {
    setPlanResult(null);
    setAdvisoryResult(null);
    scrollToSection('calculator-section');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar isLiveApi={isLiveApi} />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Section 1: Landing / Hero Section */}
        <HeroSection onCtaClick={handleHeroCta} />

        {/* Section 2: Main Dashboard (Calculator Form) */}
        <CalculatorSection 
          onSubmit={handleEvaluatePlan}
          isLoading={isEvaluating}
        />

        {/* Section 3: Banking Blueprint Results (Appears after submission) */}
        {planResult && (
          <ResultsSection 
            result={planResult}
            onGenerateAi={handleGenerateAiStrategy}
            isAiLoading={isGeneratingAi}
          />
        )}

        {/* Section 4: AI Strategic Advisory (Appears after clicking AI button) */}
        {advisoryResult && planResult && (
          <AdvisorySection 
            advisory={advisoryResult}
            planResult={planResult}
            onReset={handleReset}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
