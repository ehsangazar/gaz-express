import { Request, Response } from "express";
import logger from "../../utils/logger";
import BackupSchedulerService from "./services/BackupSchedulerService";

// Global instance of the backup scheduler
const backupScheduler = new BackupSchedulerService();

/**
 * Start the backup scheduler
 */
export const startBackupScheduler = async (req: Request, res: Response) => {
  try {
    backupScheduler.start();
    res.json({
      success: true,
      message: "Backup scheduler started successfully",
      status: backupScheduler.getStatus(),
    });
  } catch (error) {
    logger.error(`Error starting backup scheduler: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to start backup scheduler",
      error: error.message,
    });
  }
};

/**
 * Stop the backup scheduler
 */
export const stopBackupScheduler = async (req: Request, res: Response) => {
  try {
    backupScheduler.stop();
    res.json({
      success: true,
      message: "Backup scheduler stopped successfully",
      status: backupScheduler.getStatus(),
    });
  } catch (error) {
    logger.error(`Error stopping backup scheduler: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to stop backup scheduler",
      error: error.message,
    });
  }
};

/**
 * Get the status of the backup scheduler
 */
export const getBackupStatus = async (req: Request, res: Response) => {
  try {
    const status = backupScheduler.getStatus();
    const endpoints = backupScheduler.getEndpoints();
    
    res.json({
      success: true,
      status,
      endpoints,
    });
  } catch (error) {
    logger.error(`Error getting backup status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get backup status",
      error: error.message,
    });
  }
};

/**
 * Manually trigger a backup
 */
export const triggerManualBackup = async (req: Request, res: Response) => {
  try {
    // Start the backup process in the background
    backupScheduler.triggerManualBackup().catch(error => {
      logger.error(`Manual backup failed: ${error.message}`);
    });
    
    res.json({
      success: true,
      message: "Manual backup triggered successfully",
      note: "The backup process is running in the background. Check the logs for progress.",
    });
  } catch (error) {
    logger.error(`Error triggering manual backup: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to trigger manual backup",
      error: error.message,
    });
  }
};

/**
 * Add a new backup endpoint
 */
export const addBackupEndpoint = async (req: Request, res: Response) => {
  try {
    const { url, name } = req.body;
    
    if (!url || !name) {
      return res.status(400).json({
        success: false,
        message: "URL and name are required",
      });
    }
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }
    
    backupScheduler.addEndpoint(url, name);
    
    res.json({
      success: true,
      message: "Backup endpoint added successfully",
      endpoints: backupScheduler.getEndpoints(),
    });
  } catch (error) {
    logger.error(`Error adding backup endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to add backup endpoint",
      error: error.message,
    });
  }
};

/**
 * Remove a backup endpoint
 */
export const removeBackupEndpoint = async (req: Request, res: Response) => {
  try {
    const { url } = req.params;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL parameter is required",
      });
    }
    
    backupScheduler.removeEndpoint(url);
    
    res.json({
      success: true,
      message: "Backup endpoint removed successfully",
      endpoints: backupScheduler.getEndpoints(),
    });
  } catch (error) {
    logger.error(`Error removing backup endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to remove backup endpoint",
      error: error.message,
    });
  }
};

/**
 * Get all backup endpoints
 */
export const getBackupEndpoints = async (req: Request, res: Response) => {
  try {
    const endpoints = backupScheduler.getEndpoints();
    
    res.json({
      success: true,
      endpoints,
    });
  } catch (error) {
    logger.error(`Error getting backup endpoints: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get backup endpoints",
      error: error.message,
    });
  }
}; 