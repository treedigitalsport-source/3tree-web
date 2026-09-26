/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Exponential Backoff & Retry Engine with Jitter
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

export interface RetryPolicy {
  maxAttempts: number; // Default: 4 (Initial + 3 retries)
  baseDelaysMs: number[]; // [0, 500, 2000, 8000]
  jittersMs: number[]; // [0, 50, 100, 200]
}

export interface RetryAttemptResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  attemptsMade: number;
  exhausted: boolean;
  totalDelayMs: number;
}

export class RetryEngine {
  public static readonly CANONICAL_POLICY: RetryPolicy = {
    maxAttempts: 4,
    baseDelaysMs: [0, 500, 2000, 8000],
    jittersMs: [0, 50, 100, 200]
  };

  /**
   * Calculate exact backoff delay with random jitter for a given attempt index (0-indexed)
   */
  public static calculateDelay(
    attemptIndex: number,
    policy: RetryPolicy = this.CANONICAL_POLICY
  ): number {
    if (attemptIndex <= 0) return 0;
    const boundedIndex = Math.min(attemptIndex, policy.baseDelaysMs.length - 1);
    const base = policy.baseDelaysMs[boundedIndex] || 8000;
    const maxJitter = policy.jittersMs[boundedIndex] || 200;

    // Random jitter in range [-maxJitter, +maxJitter]
    const jitter = Math.floor(Math.random() * (maxJitter * 2 + 1)) - maxJitter;
    return Math.max(0, base + jitter);
  }

  /**
   * Utility helper to wait for the specified milliseconds
   */
  public static async sleep(ms: number): Promise<void> {
    if (ms <= 0) return;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute an asynchronous task with canonical retry & jitter policy
   */
  public static async execute<T>(
    operation: (attempt: number) => Promise<T>,
    policy: RetryPolicy = this.CANONICAL_POLICY,
    onRetryCallback?: (attempt: number, error: Error, delayMs: number) => void
  ): Promise<RetryAttemptResult<T>> {
    let totalDelayMs = 0;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
      if (attempt > 0) {
        const delay = this.calculateDelay(attempt, policy);
        totalDelayMs += delay;
        if (onRetryCallback && lastError) {
          onRetryCallback(attempt, lastError, delay);
        }
        await this.sleep(delay);
      }

      try {
        const result = await operation(attempt);
        return {
          success: true,
          result,
          attemptsMade: attempt + 1,
          exhausted: false,
          totalDelayMs
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    return {
      success: false,
      error: lastError || new Error('DELIVERY_EXHAUSTED: Unknown error occurred'),
      attemptsMade: policy.maxAttempts,
      exhausted: true,
      totalDelayMs
    };
  }
}
