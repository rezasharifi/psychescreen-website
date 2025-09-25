# Troubleshooting 404 and DNS Errors

## 🔍 **Current Errors Analysis**

### 1. **404 Error - Config File Not Found**
```
Failed to load resource: the server responded with a status of 404 ()
config.js:23 Config response status: 404
config.js:32 Error loading configuration: Error: Failed to load config: 404
```

**Cause:** The `config.yaml` file is not accessible in production deployment.

**Solutions:**

#### Option A: Ensure config.yaml is in the build (Recommended)
Make sure `config.yaml` is included in your AWS Amplify build artifacts:

1. **Check amplify.yml** - Ensure config.yaml is copied during build
2. **Verify file exists** - Check that config.yaml is in the root directory
3. **Test locally** - Verify the file loads correctly in local development

#### Option B: Use Environment Variables Only (Alternative)
If config.yaml continues to cause issues, the application will automatically fall back to environment variables.

### 2. **DNS Error - Placeholder API URL**
```
your-verification-api.amazonaws.com/Prod/send-verification:1 
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
```

**Cause:** `your-verification-api.amazonaws.com` is not a real domain (it's a placeholder).

**Solution:** Update AWS Amplify Environment Variables with real API URLs.

## 🛠️ **Step-by-Step Fixes**

### Fix 1: Update AWS Amplify Environment Variables

Go to AWS Amplify Console → Your App → Environment Variables and set:

```
API_BASE_URL=https://your-actual-api-gateway.amazonaws.com/Prod/register
TWILIO_VERIFICATION_API_URL=https://your-actual-api-gateway.amazonaws.com/Prod/send-verification
TWILIO_ACCOUNT_SID=your_actual_twilio_account_sid
TWILIO_VERIFY_SERVICE_SID=your_actual_twilio_verify_service_sid
```

### Fix 2: Ensure config.yaml is Served

**Option A: Check AWS Amplify Build Configuration**
In your `amplify.yml`, ensure config.yaml is included:

```yaml
artifacts:
  baseDirectory: .
  files:
    - '**/*'  # This should include config.yaml
```

**Option B: Generate config.yaml During Build**
The AWS template repository shows how to generate config.yaml with environment variables during build.

### Fix 3: Configure CORS on API Gateway

Follow the instructions in `cors-configuration.md` to enable CORS for your API endpoints.

## 🔧 **Testing the Fixes**

### 1. Check Environment Variables
Add this to your browser console to verify environment variables are loaded:

```javascript
// Check if environment variables are available
console.log('Environment variables:', window.ENV);

// Check configuration loading
window.AppConfig.loadConfig().then(config => {
    console.log('Loaded config:', config);
});
```

### 2. Test API Endpoints
Verify your API endpoints are accessible:

```bash
# Test API endpoint (replace with your actual URL)
curl -X OPTIONS https://your-actual-api-gateway.amazonaws.com/Prod/send-verification
```

### 3. Check File Serving
Verify config.yaml is accessible:

```bash
# Test config file (replace with your actual domain)
curl https://your-amplify-domain.amplifyapp.com/config.yaml
```

## 🚨 **Emergency Workaround**

If you need to get the site working immediately:

### 1. Hardcode Configuration
Temporarily modify `config.js` to use hardcoded values:

```javascript
getDefaultConfig() {
    return {
        api: {
            base_url: "https://your-actual-api-gateway.amazonaws.com/Prod/register",
            timeout: 30000,
            retry_attempts: 3
        },
        twilio: {
            account_sid: "your_actual_twilio_account_sid",
            verify_service_sid: "your_actual_twilio_verify_service_sid",
            verification_api_url: "https://your-actual-api-gateway.amazonaws.com/Prod/send-verification"
        },
        // ... rest of config
    };
}
```

### 2. Disable Phone Verification Temporarily
Comment out the phone verification functionality until the API is properly configured.

## 📋 **Checklist for Production Deployment**

- [ ] **Environment Variables Set** - All API URLs and credentials configured
- [ ] **CORS Configured** - API Gateway allows requests from your domain
- [ ] **Config File Accessible** - config.yaml loads without 404 errors
- [ ] **API Endpoints Working** - All API calls return proper responses
- [ ] **Error Handling** - Application gracefully handles API failures
- [ ] **Console Clean** - No more 404 or DNS errors in browser console

## 🔄 **Next Steps**

1. **Set real environment variables** in AWS Amplify
2. **Configure CORS** on your API Gateway
3. **Test all functionality** end-to-end
4. **Monitor console** for any remaining errors
5. **Set up monitoring** for production issues

## 📞 **Need Help?**

If you continue to have issues:
1. Check AWS Amplify build logs
2. Verify API Gateway configuration
3. Test API endpoints independently
4. Review browser network tab for detailed error information
