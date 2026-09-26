/**
 * 3Tree Digital Sport IA LLC — Durable Security & Firewall Repository
 * Replaces raw firewall.json with structured ACID Security Ledger
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import path from 'path';
import type { ISecurityRepository, BlockedIpRecord } from './types';
import { WalDriver } from './wal-driver';

export class DurableSecurityRepository implements ISecurityRepository {
  private static instance: DurableSecurityRepository | null = null;
  private wal: WalDriver<BlockedIpRecord>;
  private blockedIps: Map<string, BlockedIpRecord> = new Map();
  private isInitialized: boolean = false;

  constructor(customBaseDir?: string) {
    const baseDir = customBaseDir || path.resolve(process.cwd(), 'data/storage');
    this.wal = new WalDriver<BlockedIpRecord>({
      baseDir,
      filename: 'security.wal.jsonl',
    });
  }

  public static getInstance(customBaseDir?: string): DurableSecurityRepository {
    if (!DurableSecurityRepository.instance) {
      DurableSecurityRepository.instance = new DurableSecurityRepository(customBaseDir);
    }
    return DurableSecurityRepository.instance;
  }

  public static resetInstance(): void {
    DurableSecurityRepository.instance = null;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const records = await this.wal.readAll();
    this.blockedIps.clear();

    for (const record of records) {
      if (record.isActive) {
        this.blockedIps.set(record.ip, record);
      } else {
        this.blockedIps.delete(record.ip);
      }
    }

    this.isInitialized = true;
  }

  public async blockIp(
    ip: string,
    reason: string,
    blockedByAgentId: string
  ): Promise<{ success: boolean; alreadyBlocked: boolean }> {
    if (!this.isInitialized) await this.init();

    if (this.blockedIps.has(ip)) {
      return { success: true, alreadyBlocked: true };
    }

    const record: BlockedIpRecord = {
      ip,
      reason,
      blockedAtUtc: new Date().toISOString(),
      blockedByAgentId,
      isActive: true,
    };

    // 1. Append to durable WAL
    await this.wal.appendRecord(record);

    // 2. Commit to memory
    this.blockedIps.set(ip, record);

    return { success: true, alreadyBlocked: false };
  }

  public async unblockIp(
    ip: string,
    reason: string,
    unblockedByAgentId: string
  ): Promise<boolean> {
    if (!this.isInitialized) await this.init();

    if (!this.blockedIps.has(ip)) {
      return false;
    }

    const record: BlockedIpRecord = {
      ip,
      reason,
      blockedAtUtc: new Date().toISOString(),
      blockedByAgentId: unblockedByAgentId,
      isActive: false,
    };

    await this.wal.appendRecord(record);
    this.blockedIps.delete(ip);

    return true;
  }

  public async isIpBlocked(ip: string): Promise<boolean> {
    if (!this.isInitialized) await this.init();
    return this.blockedIps.has(ip);
  }

  public async listBlockedIps(): Promise<BlockedIpRecord[]> {
    if (!this.isInitialized) await this.init();
    return Array.from(this.blockedIps.values());
  }

  public async clear(): Promise<void> {
    await this.wal.clear();
    this.blockedIps.clear();
    this.isInitialized = true;
  }
}
