# Postman Testing Guide

This guide will walk you through how to use the generated Postman files to instantly test the **AI Market Predictor** backend.

## Included Files
- `postman_collection.json`: Contains all configured API routes structured chronologically.
- `postman_environment.json`: Holds automated variables (`base_url`, `email`, `password`, and dynamic JWT `token`).

## Step 1: Import the Setup

1. Open Postman.
2. In the top-left corner, click **Import** (or press Ctrl/Cmd + O).
3. Drag and drop both `postman_collection.json` and `postman_environment.json` into the upload box.
4. Click **Import**.

## Step 2: Select the Environment

1. In the top-right corner of Postman, locate the Environment dropdown (it might currently say "No Environment").
2. Select **"AI Market Predictor Environment"**.
3. *Optional Check:* Click the quick-look icon (eye) next to the dropdown. You should see `base_url` pointing to `http://127.0.0.1:5000` and empty `token`.

## Step 3: Run the API Sequence

To fully test all services at once, you can run the collection:

### Option A: Sequential Testing (Automated Run)
1. Hover over the **"AI Market Predictor Platform"** collection on the left sidebar.
2. Click the three dots (`...`) and select **"Run collection"**.
3. Ensure all APIs are checked. Postman will run them in sequential order:
   - *Health Check* will verify server status.
   - *Register* and *Login* will execute, generating an `access_token`.
   - Postman will programmatically export the token into your active environment variables.
   - All subsequent APIs (Markets, Predict Price, Chatbot, Alerts) will automatically inherit the `Bearer {{token}}` seamlessly and execute successfully.

### Option B: Manual Testing
1. Expand the collection.
2. Manually click **"Login"** and press **Send** (this populates your environment dynamically).
3. Open any route below it, verify the Authorization tab uses `Bearer Token` and type `{{token}}`. Press **Send** to verify localized data.
