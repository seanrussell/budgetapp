# Budget App

[![CircleCI](https://circleci.com/gh/seanrussell/budgetapp.svg?style=svg)](https://circleci.com/gh/seanrussell/budgetapp)

## Installing Budgetapp using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

-   Enable Dev Hub in your Trailhead Playground
-   Install Salesforce CLI
-   Install Visual Studio Code
-   Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

2. If you haven't already done so, authenticate with your hub org and provide it with an alias (**myhuborg** in the command below):

```
sfdx force:auth:web:login -d -a myhuborg
```

3. Clone the repository:

```
git clone https://github.com/seanrussell/budgetapp.git
cd budgetapp
```

4. Create a scratch org:

```
sfdx force:org:create -s -f config/project-scratch-def.json
```

5. Push the app to your scratch org:

```
sfdx force:source:push
```

6. Assign the **Budget App Administrator** permission set to the default user:

```
sfdx force:user:permset:assign -n Budget_App_Administrator
```

7. Load sample data:

```
sfdx force:data:tree:import --plan ./data/sample-data.json
```

8. Open the scratch org:

```
sfdx force:org:open
```

9. In App Launcher, select the **Budgetapp** app.