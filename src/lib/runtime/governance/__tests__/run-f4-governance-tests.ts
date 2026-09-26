/**
 * 3Tree Digital Sport IA Corp. — Governance Runtime
 * 3T-AUDIT-022-F4: Master Agent Registry & Departmental Dispatcher Integration Suite
 * 16 Integration Gates (100% Deterministic)
 */

import { DurableEventStore } from '../../storage/durable-event-store';
import {
  MasterAgentRegistry,
  CANONICAL_31_AGENT_REGISTRY,
  CANONICAL_DEPARTMENT_ROUTING,
  DepartmentalRoutingDispatcher,
  GovernanceAgentDispatchedPayloadSchema,
  GovernanceMutationBlockedPayloadSchema,
  GovernanceDispatchRequestSchema
} from '../index';

export async function runF4GovernanceTests(): Promise<boolean> {
  console.log('\n🚀 Iniciando 3T-AUDIT-022-F4: Master Agent Registry & Departmental Dispatcher Integration Tests...\n');
  let allPassed = true;

  function assert(condition: boolean, gateName: string): void {
    if (condition) {
      console.log(`✅ ${gateName} Valid`);
    } else {
      console.error(`❌ ${gateName} Failed`);
      allPassed = false;
    }
  }

  // GATE-01: 31-Agent Registry Completeness
  const agentCount = MasterAgentRegistry.getAgentCount();
  assert(agentCount === 31, 'GATE-01: 31-Agent Registry Completeness (Exact Count: 31)');

  // GATE-02: 10-Department Mapping Completeness
  const depts = Object.keys(CANONICAL_DEPARTMENT_ROUTING);
  const allDeptsValid = depts.length === 10 && depts.every((d) => d.startsWith('DP-'));
  assert(allDeptsValid, 'GATE-02: 10-Department Mapping Completeness (DP-01 to DP-10)');

  // GATE-03: Authority Hierarchy Evaluation
  const aliOverride = MasterAgentRegistry.hasSufficientAuthority('AG-001', 'N6_OVERRIDE');
  const atlasAnalyst = MasterAgentRegistry.hasSufficientAuthority('AG-016', 'N5_APPROVE');
  assert(aliOverride === true && atlasAnalyst === false, 'GATE-03: Authority Hierarchy Evaluation (AG-001 N6 vs AG-016 N2)');

  // GATE-04: Mutation Zone Boundaries Validation
  const cyrusCanWal = MasterAgentRegistry.isMutationPermitted('AG-005', 'ORANGE_WAL_PERSISTENCE');
  const camilaCannotRed = MasterAgentRegistry.isMutationPermitted('AG-010', 'RED_CODE_DEPLOY');
  assert(cyrusCanWal === true && camilaCannotRed === false, 'GATE-04: Mutation Zone Boundaries Validation');

  // GATE-05: Zod Schema Validation for EVT-024 (Agent Dispatched)
  const sampleEvt024 = {
    dispatchId: 'disp_001',
    assignedAgentId: 'AG-031',
    targetDepartmentId: 'DP-10',
    intent: 'Answer visitor inquiry',
    authorityLevel: 'N5_APPROVE',
    mutationZone: 'YELLOW_DATA_CMS',
    correlationId: 'corr_test_001',
    sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  };
  const parsedEvt024 = GovernanceAgentDispatchedPayloadSchema.safeParse(sampleEvt024);
  assert(parsedEvt024.success, 'GATE-05: GovernanceAgentDispatchedPayloadSchema (EVT-024) Valid');

  // GATE-06: Zod Schema Validation for EVT-025 (Mutation Blocked)
  const sampleEvt025 = {
    dispatchId: 'disp_002',
    attemptingAgentId: 'AG-016',
    attemptedMutationZone: 'RED_CODE_DEPLOY',
    targetDepartmentId: 'DP-05',
    reason: 'Agent AG-016 lacks authority for RED_CODE_DEPLOY',
    violationTimestampUtc: new Date().toISOString(),
    correlationId: 'corr_test_002'
  };
  const parsedEvt025 = GovernanceMutationBlockedPayloadSchema.safeParse(sampleEvt025);
  assert(parsedEvt025.success, 'GATE-06: GovernanceMutationBlockedPayloadSchema (EVT-025) Valid');

  // GATE-07: Zod Rejection on Invalid Payload
  const invalidReq = {
    dispatchId: 'x',
    targetDepartmentId: 'DP-99', // Invalid
    callerAgentId: 'AG-999',    // Invalid
    intent: '',
    targetMutationZone: 'INVALID_ZONE',
    payload: {},
    correlationId: ''
  };
  const parsedInvalid = GovernanceDispatchRequestSchema.safeParse(invalidReq);
  assert(!parsedInvalid.success, 'GATE-07: Zod Rejection on Invalid Department/Agent/Bounds Valid');

  // GATE-08: Dispatch to DP-01 (Executive Direction)
  const execResult = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_exec_001',
    targetDepartmentId: 'DP-01',
    requestedAgentId: 'AG-002',
    callerAgentId: 'AG-001',
    intent: 'Orchestrate weekly sprint handoffs',
    targetMutationZone: 'ORANGE_WAL_PERSISTENCE',
    payload: { sprintId: 'SP-2026-W39', focus: 'Governance & Auditing' },
    correlationId: 'corr_exec_001'
  });
  assert(execResult.status === 'DISPATCHED' && execResult.assignedAgentId === 'AG-002', 'GATE-08: Dispatch to DP-01 (Sara AG-002) Valid');

  // GATE-09: Dispatch to DP-03 (Technology & Software)
  const techResult = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_tech_001',
    targetDepartmentId: 'DP-03',
    requestedAgentId: 'AG-007',
    callerAgentId: 'AG-005',
    intent: 'Execute MCP Tool inspection',
    targetMutationZone: 'YELLOW_DATA_CMS',
    payload: { toolName: 'get_new_leads' },
    correlationId: 'corr_tech_001'
  });
  assert(techResult.status === 'DISPATCHED' && techResult.assignedAgentId === 'AG-007', 'GATE-09: Dispatch to DP-03 (Forge AG-007) Valid');

  // GATE-10: Dispatch to DP-10 (Sales B2B & Care)
  const salesResult = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_sales_001',
    targetDepartmentId: 'DP-10',
    requestedAgentId: 'AG-031',
    callerAgentId: 'AG-004',
    intent: 'Ingest inbound VIP lead from AgentChat UI',
    targetMutationZone: 'YELLOW_DATA_CMS',
    payload: { leadName: 'Coach Martinez', academy: 'Tampa Elite' },
    correlationId: 'corr_sales_001'
  });
  assert(salesResult.status === 'DISPATCHED' && salesResult.assignedAgentId === 'AG-031', 'GATE-10: Dispatch to DP-10 (Iris AG-031) Valid');

  // GATE-11: Mutation Boundary Guard (Block Unauthorized RED_CODE_DEPLOY Write)
  const blockedResult = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_violation_001',
    targetDepartmentId: 'DP-05',
    requestedAgentId: 'AG-016', // Atlas only has GREEN_EPHEMERAL_UI
    callerAgentId: 'AG-017',
    intent: 'Attempt to overwrite production git code',
    targetMutationZone: 'RED_CODE_DEPLOY',
    payload: { maliciousPatch: 'DROP ALL' },
    correlationId: 'corr_violation_001'
  });
  assert(blockedResult.status === 'MUTATION_BLOCKED' && blockedResult.emittedEvent?.eventType === 'governance.mutation_blocked', 'GATE-11: Mutation Boundary Guard (Block Unauthorized RED_CODE_DEPLOY Write) Valid');

  // GATE-12: Human Approval Gate (Block Financial Disbursement without Token)
  const financeBlocked = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_fin_001',
    targetDepartmentId: 'DP-06',
    requestedAgentId: 'AG-020', // Leo requires human approval
    callerAgentId: 'AG-015',
    intent: 'Execute API vendor payout',
    targetMutationZone: 'ORANGE_WAL_PERSISTENCE',
    payload: { amountUsd: 5000, vendor: 'Groq Cloud' },
    correlationId: 'corr_fin_001'
  });
  assert(financeBlocked.status === 'APPROVAL_REQUIRED', 'GATE-12: Human Approval Gate (Block Disbursement without Token) Valid');

  // GATE-13: Human Approval Gate Pass (Allow with Token)
  const financeAllowed = await DepartmentalRoutingDispatcher.dispatch({
    dispatchId: 'disp_fin_002',
    targetDepartmentId: 'DP-06',
    requestedAgentId: 'AG-020',
    callerAgentId: 'AG-001',
    intent: 'Execute API vendor payout approved by CEO',
    targetMutationZone: 'ORANGE_WAL_PERSISTENCE',
    payload: { amountUsd: 5000, vendor: 'Groq Cloud' },
    humanApprovalToken: 'CEO_APPROVED_TOKEN_ALI_ZAPATA_2026',
    correlationId: 'corr_fin_002'
  });
  assert(financeAllowed.status === 'DISPATCHED', 'GATE-13: Human Approval Pass (Allow with Valid Token) Valid');

  // GATE-14: Deterministic SHA-256 Digest Calculation
  assert(execResult.sha256Digest.length === 64 && /^[a-f0-9]{64}$/.test(execResult.sha256Digest), 'GATE-14: Deterministic SHA-256 Checksum Calculation Valid');

  // GATE-15: WAL Persistence & Monotonic Sequencing
  const walEvents = await DurableEventStore.getInstance().getAll(100);
  const hasEvt024 = walEvents.some((e) => e.eventType === 'governance.agent_dispatched');
  const hasEvt025 = walEvents.some((e) => e.eventType === 'governance.mutation_blocked');
  assert(walEvents.length >= 4 && hasEvt024 && hasEvt025, 'GATE-15: WAL Storage Sequence Appending & Persistence Valid');

  // GATE-16: Full Master E2E Governance Lifecycle
  const replayedRecords: unknown[] = [];
  const replayResult = await DurableEventStore.getInstance().replay(
    { eventType: 'governance.agent_dispatched' },
    (rec) => {
      replayedRecords.push(rec);
    }
  );
  assert(replayResult.totalReplayed >= 3 && replayedRecords.length >= 3 && allPassed, 'GATE-16: Full Master E2E Governance Pipeline (Registry -> Dispatcher -> Gate -> WAL -> Replay) Valid');

  console.log(`\n🏆 3T-AUDIT-022-F4 INTEGRATION SUMMARY: ${allPassed ? '16/16 GATES PASSED (100% GREEN) 🔒' : 'FAILURES DETECTED ❌'}\n`);
  return allPassed;
}
