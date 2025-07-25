import logger from "../../../utils/logger";
import axios from "axios";

interface BackupEndpoint {
  url: string;
  name: string;
  enabled: boolean;
}

interface BackupResult {
  url: string;
  name: string;
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: string;
  timestamp: Date;
}

class BackupService {
  private endpoints: BackupEndpoint[] = [
    {
      url: "https://clubcp-b.fly.dev/admin/backup/trigger",
      name: "ClubCP Backup",
      enabled: true,
    },
  ];

  /**
   * Add a new backup endpoint
   */
  addEndpoint(url: string, name: string): void {
    this.endpoints.push({
      url,
      name,
      enabled: true,
    });
    logger.info(`Added backup endpoint: ${name} (${url})`);
  }

  /**
   * Remove a backup endpoint by URL
   */
  removeEndpoint(url: string): void {
    this.endpoints = this.endpoints.filter(endpoint => endpoint.url !== url);
    logger.info(`Removed backup endpoint: ${url}`);
  }

  /**
   * Get all backup endpoints
   */
  getEndpoints(): BackupEndpoint[] {
    return this.endpoints.filter(endpoint => endpoint.enabled);
  }

  /**
   * Trigger backup for a single endpoint
   */
  async triggerBackup(endpoint: BackupEndpoint): Promise<BackupResult> {
    const result: BackupResult = {
      url: endpoint.url,
      name: endpoint.name,
      success: false,
      timestamp: new Date(),
    };

    try {
      logger.info(`Triggering backup for: ${endpoint.name} (${endpoint.url})`);
      
      const response = await axios.post(endpoint.url, {}, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Gaz-Express-Backup-Service/1.0',
        },
      });

      result.success = true;
      result.statusCode = response.status;
      result.response = response.data;

      logger.info(`Backup successful for ${endpoint.name}: ${response.status}`);
    } catch (error) {
      result.success = false;
      result.error = error.message;
      
      if (error.response) {
        result.statusCode = error.response.status;
        result.response = error.response.data;
      }

      logger.error(`Backup failed for ${endpoint.name}: ${error.message}`);
    }

    return result;
  }

  /**
   * Trigger backup for all enabled endpoints
   */
  async triggerAllBackups(): Promise<BackupResult[]> {
    const enabledEndpoints = this.getEndpoints();
    logger.info(`Triggering backups for ${enabledEndpoints.length} endpoints`);

    const results: BackupResult[] = [];
    
    for (const endpoint of enabledEndpoints) {
      const result = await this.triggerBackup(endpoint);
      results.push(result);
      
      // Add a small delay between requests to avoid overwhelming the servers
      if (enabledEndpoints.indexOf(endpoint) < enabledEndpoints.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Generate a summary of backup results
   */
  generateSummary(results: BackupResult[]) {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;

    return {
      total,
      successful,
      failed,
      results,
    };
  }
}

export default BackupService; 