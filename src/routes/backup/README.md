# Backup System

This system provides automated daily backup functionality with email notifications. It makes POST requests to configured endpoints and sends detailed reports via email.

## Features

- **Daily Automated Backups**: Runs automatically at 2:00 AM daily
- **Multiple Endpoint Support**: Configure multiple backup endpoints
- **Email Notifications**: Sends detailed HTML reports to eadomestic@gmail.com
- **Manual Triggering**: Trigger backups on-demand via API
- **Status Monitoring**: Check backup status and endpoint configuration
- **Error Handling**: Comprehensive error handling and logging

## Default Configuration

The system comes pre-configured with:
- **Endpoint**: `https://clubcp-b.fly.dev/admin/backup/trigger`
- **Name**: "ClubCP Backup"
- **Email**: eadomestic@gmail.com
- **Schedule**: Daily at 2:00 AM

## API Endpoints

### Start Backup Scheduler
```http
POST /backup/start
```
Starts the daily backup scheduler.

### Stop Backup Scheduler
```http
POST /backup/stop
```
Stops the daily backup scheduler.

### Get Backup Status
```http
GET /backup/status
```
Returns the current status of the backup scheduler and configured endpoints.

**Response:**
```json
{
  "success": true,
  "status": {
    "isRunning": false,
    "hasScheduler": true
  },
  "endpoints": [
    {
      "url": "https://clubcp-b.fly.dev/admin/backup/trigger",
      "name": "ClubCP Backup",
      "enabled": true
    }
  ]
}
```

### Trigger Manual Backup
```http
POST /backup/trigger
```
Manually triggers a backup for all configured endpoints.

### Add Backup Endpoint
```http
POST /backup/endpoints
Content-Type: application/json

{
  "url": "https://example.com/backup/trigger",
  "name": "Example Backup"
}
```

### Remove Backup Endpoint
```http
DELETE /backup/endpoints/{url}
```
Removes a backup endpoint by URL (URL must be URL-encoded).

### Get All Endpoints
```http
GET /backup/endpoints
```
Returns all configured backup endpoints.

## Email Notifications

The system sends detailed HTML email reports to `eadomestic@gmail.com` after each backup execution. The email includes:

- **Summary Statistics**: Total endpoints, successful/failed counts, success rate
- **Detailed Results**: Status, URL, status code, timestamp, and error messages for each endpoint
- **Professional Styling**: Clean, responsive HTML design with color-coded status indicators

## Environment Variables

The system uses the following environment variables for email configuration:

```env
SMTP_ENDPOINT=your-smtp-server
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM=your-from-email
```

## Usage Examples

### Adding a New Backup Endpoint

```bash
curl -X POST http://localhost:3000/backup/endpoints \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://myapp.com/admin/backup",
    "name": "MyApp Backup"
  }'
```

### Triggering a Manual Backup

```bash
curl -X POST http://localhost:3000/backup/trigger
```

### Checking Backup Status

```bash
curl -X GET http://localhost:3000/backup/status
```

## Logging

The system provides comprehensive logging for all operations:

- Backup execution start/completion
- Individual endpoint success/failure
- Email sending status
- Scheduler start/stop events
- Error conditions

Logs are written using the application's logger system and can be monitored for troubleshooting.

## Error Handling

The system includes robust error handling:

- **Network Timeouts**: 30-second timeout for each backup request
- **Failed Requests**: Individual endpoint failures don't stop other backups
- **Email Failures**: Email sending failures are logged but don't affect backup execution
- **Scheduler Errors**: Comprehensive error reporting and recovery

## Testing

Run the test suite to verify functionality:

```bash
npm test
```

The tests cover:
- Endpoint management (add/remove)
- Summary generation
- Service initialization 