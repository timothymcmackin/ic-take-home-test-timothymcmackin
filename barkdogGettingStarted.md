# Getting started with Barkdog

[Barkdog](https://github.com/codenize-tools/barkdog) lets you update Datadog monitors dynamically, without having to log in to Datadog.
Datadog uses monitors to alert people of critical issues.
For more information about monitors, see [Alerting](https://docs.datadoghq.com/monitors/) in the Datadog help.

With Barkdog, you can:

- Back up monitors to any storage that you want to use
- Change who gets notified when alerts happen
- Create, update, and delete monitors programmatically
- Integrate Datadog monitors with other systems, such as updating who is notified based on changes to your company's org chart or identity access management (IAM) system
- Create multiple similar monitors based on templates
- Manage some monitors programmatically and manage others manually

## Installation and setup

1. Install Ruby on your system if it is not already installed.

1. Create an API key for Barkdog on the [Datadog API Keys](https://app.datadoghq.com/organization-settings/api-keys) page.
For security purposes, do not reuse another key.

1. Create an application key for Barkdog on the [Datadog Application Keys](https://app.datadoghq.com/organization-settings/application-keys) page and give it all of the monitoring scopes.
For security purposes, do not reuse another key.

1. Set the API key as the value of the `BARKDOG_API_KEY` environment variable.

1. Set the application key as the value of the `BARKDOG_APP_KEY` environment variable.

1. Install Barkdog either by running the command `gem install barkdog` to install it globally or by running the command `bundle add barkdog` to add Barkdog to the dependencies of an existing Ruby application.

1. Export your current monitors by running the command `barkdog -e -o Barkfile`.

If Barkdog is installed correctly, it creates a file named `Barkfile` that contains your current monitors.
You can use this file as a starting point to create and modify monitors.

## Example Barkfile

This example includes two monitors: One that alerts when a specific host stops reporting and one that alerts when the rate of SELECT queries in MySQL drops below the amount predicted by the [`anomalies()`](https://docs.datadoghq.com/dashboards/functions/algorithms/#anomalies) function.
The code for each monitor includes the same information that is on Datadog, including the message.
The `@notification` emails in the message determine who the emails are sent to.

For more information about notifications and other settings for monitors, see [Notifications](https://docs.datadoghq.com/monitors/notify/).

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :
monitor "Host has stopped reporting: {{host.name}}", :type=>"service check" do
  query "\"datadog.agent.up\".over(\"host:MYHOST\").by(\"*\").last(2).count_by_status()"
  message "@jsmith@example.com Please investigate why the host {{host.name}} has stopped reporting."
  options do
    include_tags false
    new_host_delay 300
    no_data_timeframe 2
    notify_audit false
    notify_no_data true
    renotify_interval 0
    silenced({})
    thresholds "critical"=>1, "ok"=>1, "warning"=>1
    timeout_h 0
  end
end

monitor "[MySQL] Unusual drop in SELECT query rate on server {{host.name}}", :type=>"query alert" do
  query "avg(last_15m):anomalies(avg:mysql.performance.com_select{*}, 'agile', 2, direction='both', interval=60, alert_window='last_15m', count_default_zero='true', seasonality='hourly') >= 1"
  message "@jsmith@example.com Please investigate the drop in the SELECT query rate on the server {{host.name}}."
  options do
    include_tags false
    new_host_delay 300
    notify_audit false
    notify_no_data false
    renotify_interval 0
    require_full_window false
    silenced({})
    threshold_windows "recovery_window"=>"last_15m", "trigger_window"=>"last_15m"
    thresholds "critical"=>1.0, "critical_recovery"=>0.0
  end
end
```

## Barkdog modes and parameters

Barkdog has two modes:

- Running Barkdog with the `-e` or `--export` option retrieves monitors from Datadog and writes them to the console or to a file.
For example:

   ```shell
   barkdog -e -o Barkfile
   ```

- Running Barkdog with the `-a` or `--apply` option creates, updates, and deletes monitors in Datadog to make them match the contents of a Barkfile.
For example:

   ```shell
   barkdog -a -f Barkfile
   ```

The `barkdog` command-line command has these options:

| Option | Description |
|---|---|
| -a, --apply | Apply the changes in the specified file to the Datadog monitors, including creating, modifying, and deleting monitors. |
| --api-key API_KEY | Set the API key that Barkdog uses. By default, it uses the value of the `BARKDOG_API_KEY` environment variable. |
| --app-key APP_KEY | Set the application key that Barkdog uses. By default, it uses the value of the `BARKDOG_APP_KEY` environment variable. |
| --datadog-timeout TIMEOUT | The time to wait for a response from Datadog in seconds; by default, Barkdog waits for 5 seconds. |
| --debug | Print debugging information. |
| --delete-only-tagged TAG | When used with the `-a` option, delete only the missing monitors with the specified tag. For example, you can tag monitors created with Barkdog `auto-managed` and use this option to manage those monitors through Barkdog and not delete monitors that users create manually. |
| --dry-run | When used with the `-a` option, print the changes that Barkdog will make to the monitors without actually making any changes. |
| -e, --export | Retrieve the current monitors from Datadog and write them to the console or the file specified by the `-o` option. |
| -f, --file FILE | The file that contains the monitors; the default file name is `Barkfile`. |
| --fail-if-empty | To avoid creating duplicate monitors, do not update monitors if the response from Datadog erroneously contains no monitors.
| -h, --help | Print help information. |
| --ignore-silenced | Don't retrieve the `silenced` field, which specifies whether the monitor is silenced or not. |
| --no-color | When used with the `-a` option, print the differences between the file and the current monitors without colors. |
| --no-delete | When used with the `-a` option, update the monitors in Datadog without deleting monitors that are not in the Barkfile.
| -o, --output FILE | When used with the `-e` option, write the monitors to a file instead of printing them to STDOUT. |

## Updating monitors

To update a monitor in Datadog, change the monitor in the Barkfile and then run Barkdog with the `-a` or `--apply` option.

For example, you can change the notification in the first monitor from `@jsmith@example.com` to `@awilliams@example.com` like  this:

```ruby
monitor "Host has stopped reporting: {{host.name}}", :type=>"service check" do
  query "\"datadog.agent.up\".over(\"host:MYHOST\").by(\"*\").last(2).count_by_status()"
  message "@awilliams@example.com Please investigate why the host {{host.name}} has stopped reporting."
  options do
    include_tags false
    new_host_delay 300
    no_data_timeframe 2
    notify_audit false
    notify_no_data true
    renotify_interval 0
    silenced({})
    thresholds "critical"=>1, "ok"=>1, "warning"=>1
    timeout_h 0
  end
end
```

Then, run Barkdog in dry-run mode with this command:

```shell
barkdog -a --dry-run
```

In dry-run mode, Barkdog doesn't make changes.
Instead, it illustrates the changes that it will apply with a diff format, as in this screenshot:

![The result of the Barkdog dry run mode, showing one changed line](./images/BarkdogDryRunDiff.png)

**Important**: If you remove a monitor from the Barkfile and then apply the Barkfile, Barkdog deletes that monitor from Datadog unless you include the `--no-delete` flag.

When you are ready to make the changes in Datadog, run this command:

```shell
barkdog -a
```

Barkdog reads the Barkfile and makes the updates in Datadog.
You can specify a different file name with the `-f` or `--file` option.

## Managing notification lists

If your organization keeps track of teams in an IAM system or external org chart, you can use that data to keep notification lists updated in Datadog.
This way, Datadog always notifies the correct people, even as team members change.

For example, suppose you retrieve updates to team members from an org chart and write them to a file named `teams.yaml`.
This example shows the members of two teams and the tags of the Datadog hosts that they manage:

```yaml
teamA:
  members:
    - jsmith@example.com
    - awilliams@example.com
  hostTags:
    - "team:TEAM_A1"
    - "team:TEAM_A2"
teamB:
  members:
    - jdoe@example.com
    - abrown@example.com
  hostTags:
    - "team:TEAM_B1"
    - "team:TEAM_B2"
```

You can import this file in your Barkfile and add the members to the appropriate hosts.
For example, this Barkfile notifies members of team A of problems with their host tags and members of team B of problems with hosts with their host tags:

```ruby
require 'yaml'

TEAMS = YAML.load_file('teams.yaml')

TEAM_A_MEMBERS = TEAMS["teamA"]["members"]
TEAM_A_MEMBERS = TEAMS["teamB"]["members"]
TEAM_A_TAGS = TEAMS["teamA"]["hostTags"]
TEAM_B_TAGS = TEAMS["teamB"]["hostTags"]

monitor "CPU load is high on {{host.name}}", :type=>"query alert" do
  query "avg(last_5m):avg:system.load.1{#{TEAM_A_TAGS.map { |tag| tag }.join(", ")}} > 0.95"
  message "#{TEAM_A_MEMBERS.map { |email| "@#{email}" }.join(", ")} Please investigate high CPU load on {{host.name}}."
  options do
    include_tags false
    new_host_delay 300
    notify_audit false
    notify_no_data false
    renotify_interval 0
    require_full_window false
    silenced({})
    thresholds "critical"=>0.95
  end
end

monitor "CPU load is high on {{host.name}}", :type=>"query alert" do
  query "avg(last_5m):avg:system.load.1{#{TEAM_B_TAGS.map { |tag| tag }.join(", ")}} > 0.95"
  message "#{TEAM_B_MEMBERS.map { |email| "@#{email}" }.join(", ")} Please investigate high CPU load on {{host.name}}."
  options do
    include_tags false
    new_host_delay 300
    notify_audit false
    notify_no_data false
    renotify_interval 0
    require_full_window false
    silenced({})
    thresholds "critical"=>0.95
  end
end
```

Now you can run regular Barkdog jobs and keep the notifications up to date as your organization's teams change.

## Using templates

You can create multiple monitors based on a template.

To create a template, use Barkdog `template` keyword to set the common parameters for the monitors.
You can include parameters as properties of the `context` object and provide values later.

For example, this code creates a template named `CPU template` that alerts when CPU usage on a host is above 95%.
It includes parameters for the host and the notification message:

```ruby
template "CPU load template" do
  query "avg(last_5m):avg:system.load.1#{context.target} > 0.95"
  message context.message
  options do
    include_tags false
    new_host_delay 300
    notify_audit false
    notify_no_data false
    renotify_interval 0
    require_full_window false
    silenced({})
    thresholds "critical"=>0.95
  end
end
```

This code creates two monitors from that template and specifies values for the parameters:

```ruby
monitor "CPU load on host A", :type=> "metric alert" do
  context.target = "host:hostA"
  context.message = "@awilliams@example.com Please investigate high CPU load on {{host.name}}."
  include_template "CPU load template"
end

monitor "CPU load on host B", :type=> "metric alert" do
  context.target = "host:hostB"
  context.message = "@jsmith@example.com Please investigate high CPU load on {{host.name}}."
  include_template "CPU load template"
end
```
