/**
 * 3Tree Digital Sport IA LLC — Durable Leads Repository
 * Replaces unstructured JSON file writes with structured ACID Ledger & Indexing
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import path from 'path';
import type { LeadRecord } from '../mcp/types';
import type { ILeadsRepository } from './types';
import { WalDriver } from './wal-driver';

export class DurableLeadsRepository implements ILeadsRepository {
  private static instance: DurableLeadsRepository | null = null;
  private wal: WalDriver<LeadRecord>;
  private leadsMap: Map<string, LeadRecord> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> leadId
  private isInitialized: boolean = false;

  constructor(customBaseDir?: string) {
    const baseDir = customBaseDir || path.resolve(process.cwd(), 'data/storage');
    this.wal = new WalDriver<LeadRecord>({
      baseDir,
      filename: 'leads.wal.jsonl',
    });
  }

  public static getInstance(customBaseDir?: string): DurableLeadsRepository {
    if (!DurableLeadsRepository.instance) {
      DurableLeadsRepository.instance = new DurableLeadsRepository(customBaseDir);
    }
    return DurableLeadsRepository.instance;
  }

  public static resetInstance(): void {
    DurableLeadsRepository.instance = null;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const records = await this.wal.readAll();
    this.leadsMap.clear();
    this.emailIndex.clear();

    for (const record of records) {
      this.leadsMap.set(record.id, record);
      if (record.email) {
        this.emailIndex.set(record.email.toLowerCase(), record.id);
      }
    }

    this.isInitialized = true;
  }

  public async saveLead(lead: LeadRecord): Promise<LeadRecord> {
    if (!this.isInitialized) await this.init();

    // 1. Append to durable WAL
    await this.wal.appendRecord(lead);

    // 2. Commit in memory
    this.leadsMap.set(lead.id, lead);
    if (lead.email) {
      this.emailIndex.set(lead.email.toLowerCase(), lead.id);
    }

    return lead;
  }

  public async getLeadById(id: string): Promise<LeadRecord | null> {
    if (!this.isInitialized) await this.init();
    return this.leadsMap.get(id) || null;
  }

  public async getLeadByEmail(email: string): Promise<LeadRecord | null> {
    if (!this.isInitialized) await this.init();
    const leadId = this.emailIndex.get(email.toLowerCase());
    return leadId ? this.leadsMap.get(leadId) || null : null;
  }

  public async updateStatus(
    id: string,
    status: 'VIP' | 'general' | 'spam' | 'pending',
    updatedByAgentId?: string
  ): Promise<LeadRecord> {
    if (!this.isInitialized) await this.init();
    const existing = this.leadsMap.get(id);
    if (!existing) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const updated: LeadRecord = {
      ...existing,
      status,
    };

    await this.saveLead(updated);
    return updated;
  }

  public async listLeads(filter?: {
    status?: 'VIP' | 'general' | 'spam' | 'pending' | 'all';
    limit?: number;
    offset?: number;
  }): Promise<LeadRecord[]> {
    if (!this.isInitialized) await this.init();
    let list = Array.from(this.leadsMap.values());

    if (filter?.status && filter.status !== 'all') {
      list = list.filter((l) => l.status === filter.status);
    }

    const offset = filter?.offset ?? 0;
    const limit = filter?.limit ?? 100;
    return list.slice(offset, offset + limit);
  }

  public async count(): Promise<number> {
    if (!this.isInitialized) await this.init();
    return this.leadsMap.size;
  }

  public async clear(): Promise<void> {
    await this.wal.clear();
    this.leadsMap.clear();
    this.emailIndex.clear();
    this.isInitialized = true;
  }
}
