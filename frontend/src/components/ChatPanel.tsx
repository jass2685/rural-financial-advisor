import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { AiAdvisoryResult, PlanEvaluationResult, ChatMessage } from '../types';
import { formatINR, sendChatMessage } from '../services/api';

interface ChatPanelProps {
  advisory: AiAdvisoryResult;
  planResult: PlanEvaluationResult;
}

const QUICK_QUESTIONS = [
  "How can I reduce my biggest risk?",
  "How to get Mudra loan approved faster?",
  "What is my estimated break-even timeline?",
  "Which government scheme should I apply for first?",
  "How much working capital buffer should I keep?",
  "What if revenue drops by 30% in off-season?",
];

function generateLocalAnswer(
  question: string,
  advisory: AiAdvisoryResult,
  planResult: PlanEvaluationResult
): string {
  const q = question.toLowerCase();
  const loc = planResult.userInput.location;
  const biz = planResult.userInput.dreamBusiness;
  const scheme = planResult.matchedGovScheme;
  const emi = formatINR(planResult.estimatedEmi);
  const loan = formatINR(planResult.maxSafeLoanAmount);

  if (q.includes('risk') || q.includes('danger') || q.includes('mitigat')) {
    const topRisk = advisory.riskAnalysis?.riskFactors?.[0] || advisory.keyFinancialRisks[0];
    const topMitigation = advisory.riskAnalysis?.mitigation?.[0] || `Apply for ${scheme} interest subvention to lower borrowing costs`;
    return `**Risk Mitigation Protocol for ${biz}:**\n\n• **Primary Operational Risk:** ${topRisk}\n• **Mitigation Action:** ${topMitigation}\n\n**Financial Guardrail:** Maintain a minimum 45-day working capital buffer (approx. ${formatINR(planResult.estimatedEmi * 1.5)}) in a separate current account to cover lean months without missing your ${emi}/month debt obligation.`;
  }

  if (q.includes('break') || q.includes('profit') || q.includes('earn') || q.includes('timeline')) {
    const months = planResult.creditRisk === 'LOW_RISK' ? '8–12' : planResult.creditRisk === 'MODERATE_RISK' ? '12–18' : '14–22';
    return `**Break-Even Projection:**\n\n• **Estimated Window:** ${months} months following commercial launch.\n• **Revenue Floor:** The unit must generate at minimum **${formatINR(planResult.estimatedEmi * 3)} to ${formatINR(planResult.estimatedEmi * 4)}/month** in gross receipts to service the ${emi}/mo EMI and maintain positive working capital.\n\n**Key Actions:**\n1. Sign advance purchase agreements with local FPOs before machinery delivery.\n2. Target 60–70% capacity utilization by Month 3.`;
  }

  if (q.includes('loan') || q.includes('mudra') || q.includes('scheme') || q.includes('approv') || q.includes('bank')) {
    return `**Fast-Tracking Bank Sanction under ${scheme}:**\n\n1. **Visit District Industries Centre (DIC) in ${loc}:** Obtain an in-principle endorsement letter, giving your dossier Priority Sector Lending (PSL) status.\n2. **Documentation Checklist:**\n   • Aadhaar & PAN linked with mobile\n   • 6-month savings bank statements\n   • 2 certified machinery vendor quotations with GSTIN\n   • Gram Panchayat premises NOC / lease agreement\n3. **Apply Online:** File directly on mudra.org.in or kviconline.gov.in with sanction limit of **${loan}**.`;
  }

  if (q.includes('working capital') || q.includes('buffer') || q.includes('cash')) {
    const wc = formatINR(planResult.estimatedEmi * 2);
    return `**Working Capital Architecture:**\n\n• **Minimum Liquid Buffer:** ${wc} to ${formatINR(planResult.estimatedEmi * 3)}.\n• **Credit Terms:** Rural institutional buyers typically clear invoices on Net-25/30 terms. Budget your inventory purchases so receivables delays do not impact your ${emi}/month EMI schedule.`;
  }

  if (q.includes('drop') || q.includes('stress') || q.includes('30%') || q.includes('worst')) {
    return `**Downside Stress Analysis (30% Revenue Drop):**\n\n• The monthly debt obligation of ${emi} remains fixed.\n• With a 30% contraction in revenue, break-even shifts by 3–4 months.\n• With a 45-day liquid reserve, debt serviceability remains solvent without default.`;
  }

  return `**Advisory Guidance for ${biz} in ${loc}:**\n\n• **Sized Borrowing Capacity:** ${loan} at ${emi}/month\n• **Program:** ${scheme}\n• **Key Advantage:** ${advisory.competitiveEdge}\n\n**Next Action:** Register on the MSME Udyam Portal (udyamregistration.gov.in) and obtain your 19-digit registration number before visiting the lead bank branch.`;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ advisory, planResult }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I have synthesized the banking blueprint and market profile for your **${planResult.userInput.dreamBusiness}** in **${planResult.userInput.location}**.\n\nYou can ask specific operational or regulatory questions regarding Mudra/PMEGP processing, subsidy release, bank documentation, or break-even management.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const text = (questionText || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let finalAnswer = '';
    try {
      const chatRes = await sendChatMessage(text, {
        businessType: planResult.userInput.dreamBusiness,
        location: planResult.userInput.location,
        loanAmount: planResult.maxSafeLoanAmount,
        emi: planResult.estimatedEmi,
        schemeName: planResult.matchedGovScheme,
        riskLevel: planResult.creditRisk,
      });

      if (chatRes.isLiveApi && chatRes.answer) {
        finalAnswer = chatRes.answer;
        if (chatRes.sources && chatRes.sources.length > 0) {
          finalAnswer += `\n\n*Verified References:* ${chatRes.sources.join(' • ')}`;
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 400));
        finalAnswer = generateLocalAnswer(text, advisory, planResult);
      }
    } catch {
      finalAnswer = generateLocalAnswer(text, advisory, planResult);
    }

    const assistantMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      role: 'assistant',
      content: finalAnswer,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return (
        <div key={idx} className={line === '' ? 'h-2' : 'min-h-[1.2rem]'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} className="text-gray-500 italic text-[11px]">{part.slice(1, -1)}</em>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[460px] shadow-xs">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-700 shrink-0 mt-0.5 font-semibold text-[11px]">
                A
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-md p-3 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-2xs'
              }`}
            >
              {renderContent(msg.content)}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded bg-emerald-700 flex items-center justify-center text-white shrink-0 mt-0.5 text-[11px] font-semibold">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs pl-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
            <span>Consulting statutory guidelines...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries Bar */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-mono text-gray-400 shrink-0">Quick Queries:</span>
        {QUICK_QUESTIONS.slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 text-[11px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Mudra sanction, DIC endorsement, or subsidy release..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-xs focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white transition-colors disabled:opacity-40 cursor-pointer"
          title="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
