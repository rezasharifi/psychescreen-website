# CORS Configuration for AWS API Gateway

## Problem
Your API Gateway is blocking requests from your Amplify website due to missing CORS headers.

## Solution: Configure CORS on API Gateway

### Step 1: Add CORS to API Gateway

1. **Go to AWS API Gateway Console**
2. **Select your API** (the one with the endpoint `uiw1g8s709.execute-api.us-east-1.amazonaws.com`)
3. **Select the resource/method** that handles verification
4. **Click "Actions" → "Enable CORS"**

### Step 2: Configure CORS Settings

```
Access-Control-Allow-Origin: https://main.d2r70chw14b604.amplifyapp.com
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Max-Age: 600
```

### Step 3: Add OPTIONS Method

1. **Select your resource**
2. **Click "Actions" → "Create Method"**
3. **Select "OPTIONS"**
4. **Configure the method:**
   - Integration type: Mock
   - Mock integration: Check "Use Lambda Proxy integration"
   - Mock response: 200

### Step 4: Deploy API

1. **Click "Actions" → "Deploy API"**
2. **Select your deployment stage** (Prod)
3. **Click "Deploy"**

## Alternative: Update API Gateway CORS via AWS CLI

```bash
# Get your API Gateway ID
aws apigateway get-rest-apis --query 'items[?name==`your-api-name`].id'

# Enable CORS for a resource
aws apigateway put-method \
    --rest-api-id YOUR_API_ID \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS

aws apigateway put-integration \
    --rest-api-id YOUR_API_ID \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-http-method OPTIONS \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}'

aws apigateway put-method-response \
    --rest-api-id YOUR_API_ID \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true,method.response.header.Access-Control-Allow-Origin=true

aws apigateway put-integration-response \
    --rest-api-id YOUR_API_ID \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''","method.response.header.Access-Control-Allow-Methods":"'\''GET,POST,PUT,DELETE,OPTIONS'\''","method.response.header.Access-Control-Allow-Origin":"'\''https://main.d2r70chw14b604.amplifyapp.com'\''"}'
```

## Test CORS Configuration

After configuring CORS, test with:

```bash
curl -X OPTIONS \
  -H "Origin: https://main.d2r70chw14b604.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://uiw1g8s709.execute-api.us-east-1.amazonaws.com/Prod/send-verification
```

You should see CORS headers in the response.

## For Production with Custom Domain

When you set up a custom domain, update the CORS origin to your custom domain:

```
Access-Control-Allow-Origin: https://yourdomain.com
```

Or use a wildcard for multiple domains:

```
Access-Control-Allow-Origin: *
```

**Note:** Wildcard (*) is less secure but easier for development.
