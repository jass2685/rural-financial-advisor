import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-10 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Regulatory Mandate */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                Rural Financial Advisor
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 border border-gray-300">
                Institutional Edition
              </span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed max-w-md">
              A specialized credit underwriting and policy advisory platform for rural micro-enterprises. 
              Computes mathematical debt limits under Reserve Bank of India Priority Sector Lending standards 
              and maps central government capital subsidies.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Conforms to RBI Master Direction – Priority Sector Lending Targets and Classification</span>
            </div>
          </div>

          {/* Statutory Scheme Portals */}
          <div className="space-y-2">
            <h4 className="text-gray-900 font-semibold text-xs uppercase tracking-wider font-mono">
              Statutory Schemes
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a 
                  href="https://www.mudra.org.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>Pradhan Mantri Mudra Yojana</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.kviconline.gov.in/pmegpeportal" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>PMEGP e-Portal (KVIC)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://udyamregistration.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>MSME Udyam Registration</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nabard.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>NABARD Agri-Infrastructure Fund</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Microservice Endpoints */}
          <div className="space-y-2">
            <h4 className="text-gray-900 font-semibold text-xs uppercase tracking-wider font-mono">
              System Architecture
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded bg-white border border-gray-200">
                <span className="text-emerald-800 font-semibold">POST</span> /api/plans
                <span className="text-gray-500 block text-[10px] font-sans mt-0.5">Spring Boot Banking Core</span>
              </div>
              <div className="p-2 rounded bg-white border border-gray-200">
                <span className="text-emerald-800 font-semibold">POST</span> /v1/advisory
                <span className="text-gray-500 block text-[10px] font-sans mt-0.5">FastAPI RAG Advisory</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Rural Financial Advisor Platform. Built for SIH 2026.
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic Banking Core</span>
            <span>•</span>
            <span>Automated Scheme Sizing</span>
            <span>•</span>
            <span>Hyper-Local Market Intelligence</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
