import { runF4GovernanceTests } from './run-f4-governance-tests';

runF4GovernanceTests().then((success) => {
  if (!success) {
    process.exit(1);
  }
  process.exit(0);
}).catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
