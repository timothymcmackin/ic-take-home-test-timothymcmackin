/**
 * 1. Use the Datadog API to create a Dashboard that contains:
    - Your custom metric (`my_metric`) scoped over your host.
    - Any metric from the Integration on your Database with the anomaly function applied.
   Include the script you used to create your Dashboard and a link to your shared Dashboard.

   Prereqs:
   Set DD_API_KEY, DD_APP_KEY, and DD_SITE environment variables and required scopes
*/

/**
* Create a distribution widget using a histogram request containing a formulas and functions metrics query
* https://docs.datadoghq.com/api/latest/dashboards/#create-a-new-dashboard
*/

import { client, v1 } from "@datadog/datadog-api-client";

const configuration = client.createConfiguration();
const apiInstance = new v1.DashboardsApi(configuration);

// Got this body by creating the dashboard in the UI first and then calling `getDashboard()` to get its JSON code
const params: v1.DashboardsApiCreateDashboardRequest = {
  body: {
    title: "TPM dashboard from API",
    "widgets": [
      {
        "definition": {
          "legendColumns": [
            "avg",
            "min",
            "max",
            "value",
            "sum"
          ],
          "legendLayout": "auto",
          "requests": [
            {
              "displayType": "line",
              "formulas": [
                {
                  "formula": "query1"
                }
              ],
              "queries": [
                {
                  "dataSource": "metrics",
                  "name": "query1",
                  "query": "sum:my_metric{test:mykey}"
                }
              ],
              "responseFormat": "timeseries",
              "style": {
                "lineType": "solid",
                "lineWidth": "normal",
                "palette": "dog_classic"
              }
            }
          ],
          "showLegend": true,
          "title": "",
          "titleAlign": "left",
          "titleSize": "16",
          "type": "timeseries"
        },
        "id": 7645163686609391,
        "layout": {
          "height": 2,
          "width": 4,
          "x": 0,
          "y": 0
        }
      },
      {
        "definition": {
          "legendColumns": [
            "avg",
            "min",
            "max",
            "value",
            "sum"
          ],
          "legendLayout": "auto",
          "requests": [
            {
              "displayType": "line",
              "formulas": [
                {
                  "formula": "anomalies(query2, 'basic', 2)"
                }
              ],
              "queries": [
                {
                  "dataSource": "metrics",
                  "name": "query2",
                  "query": "avg:mysql.performance.cpu_time{test:mykey}"
                }
              ],
              "responseFormat": "timeseries",
              "style": {
                "lineType": "solid",
                "lineWidth": "normal",
                "palette": "dog_classic"
              }
            }
          ],
          "showLegend": true,
          "time": {},
          "title": "",
          "titleAlign": "left",
          "titleSize": "16",
          "type": "timeseries"
        },
        "id": 5303992400967026,
        "layout": {
          "height": 2,
          "width": 4,
          "x": 4,
          "y": 0
        }
      }
    ],
    layoutType: "ordered",
  },
};

apiInstance
  .createDashboard(params)
  .then((data: v1.Dashboard) => {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  })
  .catch((error: any) => console.error(error));