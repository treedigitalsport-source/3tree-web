'use client';

/**
 * 3Tree Digital Sport IA LLC — MCP Tool Execution Badge Component
 * Specification: 3T-AUDIT-007 / 3T-AUDIT-011-F2
 */

import { Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ClientToolExecution } from './types';

interface ToolExecutionBadgeProps {
  tools: ClientToolExecution[];
}

export default function ToolExecutionBadge({ tools }: ToolExecutionBadgeProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 my-1.5" role="region" aria-label="Herramientas MCP ejecutadas">
      {tools.map((tool, idx) => {
        const isSuccess = tool.status === 'SUCCESS';
        return (
          <div
            key={idx}
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-sm transition-all ${
              isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-current" />
              <span className="font-semibold tracking-wide">{tool.toolName}</span>
            </div>

            {tool.executionTimeMs !== undefined && (
              <span className="text-white/40 text-[9px]">• {tool.executionTimeMs}ms</span>
            )}

            <div className="ml-auto flex items-center gap-1">
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">MCP OK</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">RBAC</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
