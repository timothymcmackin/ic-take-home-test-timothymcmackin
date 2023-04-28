If you are applying to be a Technical Writer at [Datadog](https://www.datadoghq.com/), you are in the right spot!

This take home test is meant to test the technical aptitude we expect from our writers. While it does not necessarily represent the day-to-day work, it does a really great job of letting us all know if you will be happy and thrive doing the work that we do day-to-day. 

This take home is a private branch of a private template that only you and members of the Datadog team evaluating your test have access to. Nevertheless, if you are concerned about privacy, create a temporary github account to complete this challenge. 

## Instructions

* Create a branch called `your GitHub handle/branch name`.
* Complete your responses in the `answers.md` file of your branch.
* Add links to your dashboard and screenshots inline with your responses.
* Commit as much code as you need to support your responses.
* Create a pull request and submit the PR link in Greenhouse and respond to the "Take Home Test from Datadog" email.

**If you have any questions, respond to the "Take Home Test from Datadog" email.**

## Prerequisites

Install the Datadog Agent. You can use [any OS/host](https://app.datadoghq.com/account/settings#agent) to complete this exercise. We recommend a containerized approach or set up a fresh Linux VM with Vagrant or another tool so you don’t run into any OS or dependency issues.
Sign up for a [two-week trial](https://app.datadoghq.com/signup) and select “Datadog Recruiting Candidate” in the **Company** field. 
(If you’ve already signed up for a trial, but it is running out, let us know by responding to the "Take Home Test from Datadog" email and we can extend it.)

The Datadog Agent should start reporting metrics from your local machine. The Datadog Agent is the foundation of most of the Datadog products.

## Exercise 1: Collecting Metrics

1. Add tags in the Agent config file. Attach a screenshot of your host and its tags on the **Host Map** page in Datadog.
2. Install a database on your machine (such as MongoDB, MySQL, or PostgreSQL) and set up the Datadog integration for that database. 
    - Include a screenshot or code sample of your `conf.yaml`. 
    - Attach a screenshot of your database integration dashboard.
3. Create a custom Agent check that submits a metric named "my_metric" with a random value between 0 and 1000. Include the code snippet from your metrics `yaml` and your `py` file.
4. Adjust your check's collection interval to submit the metric once every 45 seconds. Include a screenshot of your **Metrics** > **Explorer** view that shows the interval changing.
5. How do you change the collection interval without modifying the Python check file you created?

## Exercise 2: Visualizing Data

1. Use the Datadog API to create a Dashboard that contains:
    - Your custom metric (`my_metric`) scoped over your host.
    - Any metric from the Integration on your Database with the anomaly function applied.
   Include the script you used to create your Dashboard and a link to your shared Dashboard.
2. After you create your Dashboard, access the Dashboard from your Dashboard List. Set the Dashboards's timeframe to the past 5 minutes. Attach a screenshot.
3. Take a snapshot of this graph and use the @ notation to send it to yourself. Attach a screenshot.
4. What does the Anomaly graph display?

## Exercise 3: Getting Started

The Datadog community has created a substantial number of [high-quality integrations and libraries](https://docs.datadoghq.com/developers/libraries/). Select one as a topic.

Write a getting started that introduces your topic and explains the benefits it offers our users/community and the problem area it solves. Provide brief instructions for installing and setting it up, and for doing one or two key workflows with it (be sure to include workflows that are not currently included in the repos readme, but that clearly demonstrate that you understand the value and impact of the repo). Include images, code samples, and diagrams where applicable. Aim for what would be a page on the docs site when published.

This getting started should demonstrate your ability to write about a new topic and dive into its configuration, usage, and best practices. 

## References for completing this test

### Getting Started in Datadog
* [Getting Started](https://docs.datadoghq.com/getting_started/)
* [Monitoring](https://docs.datadoghq.com/monitors/)

### The Datadog Agent and Metrics
* [Guide to the Agent](http://docs.datadoghq.com/agent/)
* [Datadog Docker-image Repo](https://hub.docker.com/r/datadog/docker-dd-agent/)
* [Writing an Agent Check](https://docs.datadoghq.com/developers/write_agent_check/)
* [Datadog API](https://docs.datadoghq.com/api/)

### APM
* [Datadog Tracing](https://docs.datadoghq.com/tracing)
* [Introduction to Flask](http://flask.pocoo.org/docs/0.12/quickstart/)

### Vagrant
 * [Setting Up Vagrant](https://www.vagrantup.com/intro/getting-started/)
