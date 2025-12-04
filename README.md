# Otel Demo's

This is a repository to demo several aspects of Open Telemetery and Grafana.

## Demo 1 - 

- intro
    - game app characters, monsters, etc...
    - this is generating some telemetry
- run script to generate data
- grafana walkthrough
    - show some logs
    - show some traces
    - show some alerts
    - show span metrics dashboard

## Demo 2 - Basic alerts (not working yet)

### Setup

Before the demo make sure you have done the following steps:

- Clone the repo onto your machine
- Run the docker cluster by running `docker compose up --build` in the repository directory.
- Open Grafana by going to `localhost:3000`
- In the UI go to `Alerting` > `Contact points`
- Create and save a new Contact Point with the following:
    - Name: `fatal-webook-notifier`
    - Integration: `Webhook`
    - URL: `http://notifier:3002/notify?type=fatal`
- In the UI go to `Alerting` > `Alert rules`
- Create and save a new Alert rule with the following:
    - Name: `fatal-log-notifier`
    - Data Source: `Loki`
    - Options > Time Range: `now-1m`
    - Query type: `Code`
    - Query code: `count_over_time({detected_level="fatal"}[$__auto])`
    - Set evaluation behavior > New evaluation group: `fatal-logs`
    - Set evaluation behavior > Keep firing for: `None`
    - Set evaluation behavior > Keep firing for: `None`
    - Configure notifications > Contact point: `fatal-webook-notifier`

### Demo 

With the docker compose running send an http GET request to `localhost:3002`.
You should expect to see an empty list. This is the list of notifications. Next
send another GET request to `localhost:3002/oops`. This will log a fatal error
and trigger a notification. It may take upto 1 minute for that notification to
show up. Continue to sent get requests to `localhost:3002` until the
notification shows up. 

