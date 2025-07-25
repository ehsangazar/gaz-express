import logger from "../../../utils/logger";
import BackupService from "./BackupService";
import BackupEmailService from "./BackupEmailService";

class BackupSchedulerService {
  private backupService: BackupService;
  private emailService: BackupEmailService;
  private dailyInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.backupService = new BackupService();
    this.emailService = new BackupEmailService();
  }

  /**
   * Start the daily backup scheduler
   */
  start(): void {
    if (this.dailyInterval) {
      logger.warn("Backup scheduler is already running");
      return;
    }

    logger.info("Starting daily backup scheduler");
    
    // Calculate time until next 2:00 AM
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(2, 0, 0, 0); // Set to 2:00 AM
    
    // If it's already past 2:00 AM today, schedule for tomorrow
    if (now.getHours() >= 2) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    
    logger.info(`Next backup scheduled for: ${nextRun.toLocaleString()}`);
    
    // Schedule the first run
    setTimeout(() => {
      this.executeDailyBackup();
      
      // Then set up the daily interval (24 hours = 24 * 60 * 60 * 1000 milliseconds)
      this.dailyInterval = setInterval(() => {
        this.executeDailyBackup();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilNextRun);
  }

  /**
   * Stop the daily backup scheduler
   */
  stop(): void {
    if (this.dailyInterval) {
      clearInterval(this.dailyInterval);
      this.dailyInterval = null;
      logger.info("Daily backup scheduler stopped");
    }
  }

  /**
   * Execute the daily backup process
   */
  async executeDailyBackup(): Promise<void> {
    if (this.isRunning) {
      logger.warn("Backup process is already running, skipping this execution");
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    
    try {
      logger.info("Starting daily backup execution");
      
      // Trigger all backups
      const results = await this.backupService.triggerAllBackups();
      
      // Generate summary
      const summary = this.backupService.generateSummary(results);
      
      // Send email notification
      const emailSent = await this.emailService.sendBackupNotification(summary);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      logger.info(`Daily backup completed in ${duration}ms. Email sent: ${emailSent}`);
      logger.info(`Backup summary: ${summary.successful}/${summary.total} successful`);
      
    } catch (error) {
      logger.error(`Error during daily backup execution: ${error.message}`);
      
      // Try to send error notification
      try {
        const errorSummary = {
          total: 0,
          successful: 0,
          failed: 1,
          results: [{
            url: 'N/A',
            name: 'Scheduler Error',
            success: false,
            error: error.message,
            timestamp: new Date(),
          }],
        };
        
        await this.emailService.sendBackupNotification(errorSummary);
      } catch (emailError) {
        logger.error(`Failed to send error notification email: ${emailError.message}`);
      }
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Manually trigger a backup (for testing or immediate execution)
   */
  async triggerManualBackup(): Promise<void> {
    logger.info("Manual backup triggered");
    await this.executeDailyBackup();
  }

  /**
   * Get the current status of the scheduler
   */
  getStatus(): { isRunning: boolean; hasScheduler: boolean } {
    return {
      isRunning: this.isRunning,
      hasScheduler: this.dailyInterval !== null,
    };
  }

  /**
   * Get all configured backup endpoints
   */
  getEndpoints() {
    return this.backupService.getEndpoints();
  }

  /**
   * Add a new backup endpoint
   */
  addEndpoint(url: string, name: string): void {
    this.backupService.addEndpoint(url, name);
  }

  /**
   * Remove a backup endpoint
   */
  removeEndpoint(url: string): void {
    this.backupService.removeEndpoint(url);
  }
}

export default BackupSchedulerService; 