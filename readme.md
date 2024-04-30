## Mail Scheduler

### Overview

This project is a mail scheduler designed to handle various email-related tasks, including scheduling and sending emails based on predefined events. It provides a simple yet efficient solution for managing email communication in your application.

### Installation and Development

To get started with the project, follow these steps:

1. Clone this repository

```
git clone https://github.com/ehsangazar/mail-scheduler
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

### Production Deployment

For production deployment, use the following command:

```
npm run start
```

### Usage

The project exposes a route that accepts requests for scheduling emails. You can send a request using tools like cURL, providing the event name and user email address in the request body.

Example cURL request:

```
curl --location 'localhost:3000/event' \
--header 'Content-Type: application/json' \
--data-raw '{
    "eventName": "socksPurchased",
    "userEmail": "me@gazar.dev"
}'
```

### Technical Notes

Before diving into the codebase, it's recommended to review the provided MindMap diagram, which offers a clear overview of the project structure and components.

Key Components:

- <b>EmailQueueService</b>: Manages a simple queue for email tasks.
- <b>EmailService</b>: Handles the sending of emails.
- <b>EventService</b>: Utilizes 'EventEmitter' for implementing an event-driven approach.
- <b>FlowManagerService</b>: Responsible for orchestrating the various flows within the application.
- <b>TaskQueueService</b>: Utilizes a database with sorting capabilities for managing scheduled tasks.

### Author

This project was developed by @ehsangazar. Feel free to reach out for any questions or feedback.
