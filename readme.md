## HealthTech Mail Scheduler

This is a project based on the requirement listed below, to create a mail scheduler.
[Documentation](https://healthtech1.notion.site/Healthtech-1-Engineer-Take-Home-Test-7a0cf51aa622466eb851763ebc4bf2e6)

## How To Install and Develop

First clone the project and then run

```
npm install
```

then you should be set to run

```
npm run dev
```

## How to Production

```
npm run start
```

## Routes

There is a route exposed in this project which you can send request to like:

```
curl --location 'localhost:3000/event' \
--header 'Content-Type: application/json' \
--data-raw '{
    "eventName": "socksPurchased",
    "userEmail": "me@gazar.dev"
}'
```

## Technical Notes

Pretty easy to understand
MindMap before coding:
![Diagram](https://github.com/ehsangazar/healthtech/blob/main/data/diagram.png)

- EmailQueueService: simple queue
- EmailService: to send emails
- EventService: to use 'EventEmitter' for event driven approach
- FlowManagerService: to handle the flows
- TaskQueueService: Database with sort for tasks which they are scheduled

##### Author: Ehsan Gazar (me@gazar.dev)
