/**
 * 3Tree Digital Sport IA LLC — Low-Level Write-Ahead Log (WAL) Driver
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface WalDriverConfig {
  baseDir?: string;
  filename: string;
}

export class WalDriver<TRecord = Record<string, unknown>> {
  private filePath: string;
  private writeStream: fs.WriteStream | null = null;

  constructor(config: WalDriverConfig) {
    const baseDir = config.baseDir || path.resolve(process.cwd(), 'data/storage');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    this.filePath = path.join(baseDir, config.filename);
  }

  public getPath(): string {
    return this.filePath;
  }

  /**
   * Append a single record atomically to the WAL file
   */
  public async appendRecord(record: TRecord): Promise<void> {
    const line = JSON.stringify(record) + '\n';
    await fs.promises.appendFile(this.filePath, line, 'utf8');
  }

  /**
   * Read all records sequentially from the WAL file
   */
  public async readAll(): Promise<TRecord[]> {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const content = await fs.promises.readFile(this.filePath, 'utf8');
    const lines = content.split('\n').filter((l) => l.trim().length > 0);

    const records: TRecord[] = [];
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line) as TRecord;
        records.push(parsed);
      } catch (err) {
        console.warn(`[WAL] Corrupted line skipped in ${this.filePath}:`, err);
      }
    }
    return records;
  }

  /**
   * Overwrite/Compact WAL file atomically using a temporary file
   */
  public async compact(records: TRecord[]): Promise<void> {
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    const content = records.map((r) => JSON.stringify(r)).join('\n') + (records.length > 0 ? '\n' : '');

    await fs.promises.writeFile(tempPath, content, 'utf8');
    await fs.promises.rename(tempPath, this.filePath);
  }

  /**
   * Compute SHA-256 integrity checksum of current WAL file
   */
  public async getChecksum(): Promise<string> {
    if (!fs.existsSync(this.filePath)) {
      return crypto.createHash('sha256').update('').digest('hex');
    }
    const content = await fs.promises.readFile(this.filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Clear WAL file contents
   */
  public async clear(): Promise<void> {
    if (fs.existsSync(this.filePath)) {
      await fs.promises.writeFile(this.filePath, '', 'utf8');
    }
  }
}
