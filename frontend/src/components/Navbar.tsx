import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { checkServicesHealth } from '../services/api';

interface NavbarProps {
  isLiveApi?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLiveApi = false }) => {
  const [services, setServices] = useState<{ springBoot: boolean; pythonLlm: boolean }>({
    springBoot: isLiveApi,
    pythonLlm: false,
  });

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      const status = await checkServicesHealth();
      if (mounted) {
        setServices(status);
      }
    };
    pollHealth();
    const interval = setInterval(pollHealth, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isLiveApi]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-emerald-700 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
            R
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-gray-900">
              RuralFinancial Advisor
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
              Institutional
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-600">
          <button
            onClick={() => scrollTo('hero-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo('calculator-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Calculator
          </button>
          <button
            onClick={() => scrollTo('results-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Blueprint
          </button>
          <button
            onClick={() => scrollTo('advisory-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            AI Advisory
          </button>
          <a
            href="#how-it-works"
            className="hover:text-gray-900 transition-colors"
          >
            Methodology
          </a>
        </nav>

        {/* Right: Subtle Service Status & Primary CTA */}
        <div className="flex items-center gap-3">
          {/* Subtle Microservice Status Indicators (Non-intrusive) */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-gray-400 border-r border-gray-200 pr-3">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${services.springBoot || isLiveApi ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              <span className="text-gray-500">Spring: 8080</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${services.pythonLlm ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              <span className="text-gray-500">LLM: 8000</span>
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => scrollTo('calculator-section')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <span>Calculate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
