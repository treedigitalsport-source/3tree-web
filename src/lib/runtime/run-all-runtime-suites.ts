import { execSync } from 'child_process';

interface SuiteResult {
  name: string;
  file: string;
  status: 'PASS' | 'FAIL';
  output: string;
}

const suites = [
  { name: '006 EventBus & EventStore', file: 'src/lib/runtime/event-bus/__tests__/run-f4-tests.ts' },
  { name: '007 MCP Tool Bridge', file: 'src/lib/runtime/mcp/__tests__/run-f4-mcp-tests.ts' },
  { name: '008 Agent Runtime & Memory', file: 'src/lib/runtime/agents/__tests__/run-f4-agent-tests.ts' },
  { name: '009 Groq API Inference Gateway', file: 'src/app/api/groq/__tests__/run-f4-gateway-tests.ts' },
  { name: '010 Lead Ingestion & Webhooks', file: 'src/app/api/webhooks/leads/__tests__/run-f4-ingestion-tests.ts' },
  { name: '011 Client Agent UI & Chat', file: 'src/components/ui/agent-chat/__tests__/run-f4-ui-tests.ts' },
  { name: '012 Durable Storage & WAL', file: 'src/lib/runtime/storage/__tests__/run-f4-storage-tests.ts' },
  { name: '013 Sports Runtime (DIAMAX)', file: 'src/lib/runtime/sports/__tests__/run-f4-sports-tests.ts' },
  { name: '014 Biomechanics Runtime (Kinebase)', file: 'src/lib/runtime/biomechanics/__tests__/run-f4-biomechanics-tests.ts' },
  { name: '015 Commercial Pipeline (Stripe/Resend)', file: 'src/lib/runtime/commercial/__tests__/run-f4-commercial-tests.ts' },
  { name: '016 OpenExecutive Bridge', file: 'src/lib/runtime/executive/__tests__/run-f4-executive-tests.ts' },
  { name: '017 MCP Security Firewall', file: 'src/lib/runtime/security/__tests__/run-f4-security-tests.ts' },
  { name: '018 Market Intelligence Bridge', file: 'src/lib/runtime/market/__tests__/run-f4-market-tests.ts' },
  { name: '019 Multimedia Generation Bridge', file: 'src/lib/runtime/multimedia/__tests__/run-f4-multimedia-tests.ts' },
  { name: '020 Dual Editorial & Syndication', file: 'src/lib/runtime/marketing/__tests__/run-f4-marketing-tests.ts' },
  { name: '021 Cloud Intel & Crons Failover', file: 'src/lib/runtime/cloud-intel/__tests__/run-f4-cloud-intel-tests.ts' },
];

console.log('================================================================');
console.log('🏛️ 3Tree Digital Sport IA Corp. — Master Runtime Audit Runner');
console.log('================================================================\n');

const results: SuiteResult[] = [];

for (const s of suites) {
  try {
    const out = execSync(`npx tsx "${s.file}"`, { stdio: 'pipe', encoding: 'utf8' });
    results.push({ name: s.name, file: s.file, status: 'PASS', output: out });
    console.log(`✅ [PASS] ${s.name}`);
  } catch (err: any) {
    const errMsg = err.stdout || err.stderr || err.message;
    results.push({ name: s.name, file: s.file, status: 'FAIL', output: errMsg });
    console.log(`❌ [FAIL] ${s.name}`);
  }
}

const passed = results.filter(r => r.status === 'PASS').length;
const total = results.length;

console.log('\n================================================================');
console.log(`📊 CONSOLIDATED AUDIT SUMMARY: ${passed} / ${total} SUITES PASSED (${Math.round((passed/total)*100)}%)`);
console.log('================================================================\n');

if (passed !== total) {
  process.exit(1);
}
