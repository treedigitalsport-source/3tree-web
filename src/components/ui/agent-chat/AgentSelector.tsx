'use client';

/**
 * 3Tree Digital Sport IA LLC — Multi-Agent Selector Component (10 DP x 31 AG)
 * Specification: 3T-AUDIT-004 / 3T-AUDIT-011-F2
 */

import { useState } from 'react';
import { X, Bot, ShieldCheck } from 'lucide-react';
import { CANONICAL_DEPARTMENTS } from './constants';
import type { AgentDescriptor } from './types';

interface AgentSelectorProps {
  activeAgentId: string;
  isEs: boolean;
  onSelectAgent: (agentId: string) => void;
  onClose: () => void;
}

export default function AgentSelector({ activeAgentId, isEs, onSelectAgent, onClose }: AgentSelectorProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('DP-10');

  const activeDept = CANONICAL_DEPARTMENTS.find((d) => d.id === selectedDeptId) || CANONICAL_DEPARTMENTS[0];

  return (
    <div className="absolute inset-0 z-30 bg-[#0a0f1d]/98 backdrop-blur-2xl flex flex-col p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h4 className="font-display font-bold text-white text-sm">
            {isEs ? 'Red Agéntica 3Tree (31 Agentes)' : '3Tree Agent Network (31 Agents)'}
          </h4>
          <p className="text-[10px] font-mono text-white/50">
            {isEs ? 'Selecciona un especialista de IA' : 'Select an AI specialist'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Cerrar selector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {CANONICAL_DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all ${
              selectedDeptId === dept.id
                ? 'bg-brandOrange text-white font-bold shadow-sm'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {dept.id} • {dept.code}
          </button>
        ))}
      </div>

      <div className="text-[10px] font-mono text-brandOrange font-semibold pt-2 pb-1">
        {activeDept.name}
      </div>

      {/* Agents List in Department */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 py-1">
        {activeDept.agents.map((agent: AgentDescriptor) => {
          const isCurrent = agent.agentId === activeAgentId;
          return (
            <button
              key={agent.agentId}
              onClick={() => onSelectAgent(agent.agentId)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                isCurrent
                  ? 'bg-brandOrange/15 border-brandOrange text-white shadow-[0_0_12px_rgba(242,101,34,0.2)]'
                  : 'bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-lg ${isCurrent ? 'bg-brandOrange text-white' : 'bg-white/5 text-brandOrange'}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{agent.name}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-white/60">
                      {agent.agentId}
                    </span>
                    {isCurrent && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] font-medium text-white/70 mt-0.5">{agent.role}</p>
                  <p className="text-[9px] text-white/40 mt-0.5 leading-tight">{agent.tagline}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
