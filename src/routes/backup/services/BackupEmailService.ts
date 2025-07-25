import logger from "../../../utils/logger";
import nodemailer from "nodemailer";

interface BackupResult {
  url: string;
  name: string;
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: string;
  timestamp: Date;
}

interface BackupSummary {
  total: number;
  successful: number;
  failed: number;
  results: BackupResult[];
}

class BackupEmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  /**
   * Generate HTML template for backup notification
   */
  private generateBackupEmailTemplate(summary: BackupSummary): string {
    const timestamp = new Date().toLocaleString();
    const successRate = summary.total > 0 ? ((summary.successful / summary.total) * 100).toFixed(1) : '0';
    
    let resultsHtml = '';
    summary.results.forEach(result => {
      const statusIcon = result.success ? '✅' : '❌';
      const statusClass = result.success ? 'success' : 'error';
      const statusText = result.success ? 'Success' : 'Failed';
      
      resultsHtml += `
        <tr class="${statusClass}">
          <td>${statusIcon}</td>
          <td>${result.name}</td>
          <td>${result.url}</td>
          <td>${result.statusCode || 'N/A'}</td>
          <td>${result.timestamp.toLocaleString()}</td>
          <td>${result.error || 'N/A'}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Daily Backup Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
          }
          .summary {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 15px;
          }
          .summary-item {
            text-align: center;
            padding: 15px;
            border-radius: 6px;
            background: white;
          }
          .summary-item.total { border-left: 4px solid #6c757d; }
          .summary-item.success { border-left: 4px solid #28a745; }
          .summary-item.failed { border-left: 4px solid #dc3545; }
          .summary-item h3 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .summary-item p {
            margin: 5px 0 0 0;
            color: #6c757d;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            background: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          tr.success { background-color: #f8fff9; }
          tr.error { background-color: #fff8f8; }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-success {
            background: #d4edda;
            color: #155724;
          }
          .status-error {
            background: #f8d7da;
            color: #721c24;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Daily Backup Report</h1>
            <p>Generated on ${timestamp}</p>
          </div>
          
          <div class="summary">
            <h2>📊 Summary</h2>
            <div class="summary-grid">
              <div class="summary-item total">
                <h3>${summary.total}</h3>
                <p>Total Endpoints</p>
              </div>
              <div class="summary-item success">
                <h3>${summary.successful}</h3>
                <p>Successful</p>
              </div>
              <div class="summary-item failed">
                <h3>${summary.failed}</h3>
                <p>Failed</p>
              </div>
            </div>
            <p><strong>Success Rate:</strong> ${successRate}%</p>
          </div>
          
          <h2>📋 Detailed Results</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>URL</th>
                <th>Status Code</th>
                <th>Timestamp</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              ${resultsHtml}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report was automatically generated by Gaz Express Backup Service</p>
            <p>If you have any questions, please contact the system administrator</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send backup notification email
   */
  async sendBackupNotification(summary: BackupSummary): Promise<boolean> {
    const subject = `Daily Backup Report - ${summary.successful}/${summary.total} Successful`;
    
    const htmlContent = this.generateBackupEmailTemplate(summary);
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: "eadomestic@gmail.com",
      subject: subject,
      html: htmlContent,
      text: this.generatePlainTextSummary(summary), // Fallback for email clients that don't support HTML
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Backup notification email sent successfully to eadomestic@gmail.com`);
      return true;
    } catch (error) {
      logger.error(`Failed to send backup notification email: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate plain text version of the backup summary
   */
  private generatePlainTextSummary(summary: BackupSummary): string {
    const timestamp = new Date().toLocaleString();
    const successRate = summary.total > 0 ? ((summary.successful / summary.total) * 100).toFixed(1) : '0';
    
    let text = `Daily Backup Report - ${timestamp}\n\n`;
    text += `SUMMARY:\n`;
    text += `Total Endpoints: ${summary.total}\n`;
    text += `Successful: ${summary.successful}\n`;
    text += `Failed: ${summary.failed}\n`;
    text += `Success Rate: ${successRate}%\n\n`;
    
    text += `DETAILED RESULTS:\n`;
    text += `================\n\n`;
    
    summary.results.forEach(result => {
      const status = result.success ? 'SUCCESS' : 'FAILED';
      text += `${status} - ${result.name}\n`;
      text += `URL: ${result.url}\n`;
      text += `Status Code: ${result.statusCode || 'N/A'}\n`;
      text += `Timestamp: ${result.timestamp.toLocaleString()}\n`;
      if (result.error) {
        text += `Error: ${result.error}\n`;
      }
      text += `\n`;
    });
    
    text += `Generated by Gaz Express Backup Service`;
    
    return text;
  }
}

export default BackupEmailService; 