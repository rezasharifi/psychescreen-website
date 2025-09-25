// Configuration loader for the application
class ConfigLoader {
    constructor() {
        this.config = null;
        // Determine the correct path based on current location
        const currentPath = window.location.pathname;
        if (currentPath.includes('/dashboard/')) {
            this.configPath = '../config.yaml';
        } else {
            this.configPath = 'config.yaml';
        }
        
        // For production deployment, always use relative path
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            this.configPath = 'config.yaml';
        }
    }

    async loadConfig() {
        try {
            console.log('Loading config from:', this.configPath);
            const response = await fetch(this.configPath);
            console.log('Config response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            
            const yamlText = await response.text();
            this.config = this.parseYAML(yamlText);
            console.log('Configuration loaded successfully');
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            console.log('Falling back to default configuration');
            // Fallback to default configuration
            this.config = this.getDefaultConfig();
            return this.config;
        }
    }

    parseYAML(yamlText) {
        // Simple YAML parser for basic key-value pairs
        const config = {};
        const lines = yamlText.split('\n');
        let currentSection = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip comments and empty lines
            if (trimmedLine.startsWith('#') || trimmedLine === '') {
                continue;
            }

            // Check for section headers (keys ending with :)
            if (trimmedLine.endsWith(':') && !trimmedLine.includes(' ')) {
                currentSection = trimmedLine.slice(0, -1);
                config[currentSection] = {};
                continue;
            }

            // Parse key-value pairs
            if (trimmedLine.includes(':') && currentSection) {
                const colonIndex = trimmedLine.indexOf(':');
                const key = trimmedLine.substring(0, colonIndex).trim();
                let value = trimmedLine.substring(colonIndex + 1).trim();
                
                // Remove inline comments
                const commentIndex = value.indexOf('#');
                if (commentIndex !== -1) {
                    value = value.substring(0, commentIndex).trim();
                }

                // Convert value types
                if (value === 'true' || value === 'false') {
                    value = value === 'true';
                } else if (!isNaN(value) && value !== '') {
                    value = Number(value);
                } else if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }

                config[currentSection][key] = value;
            }
        }

        return config;
    }

    getDefaultConfig() {
        // Try to get configuration from environment variables (set by AWS Amplify)
        const getEnvVar = (name, defaultValue) => {
            // Check if we're in a browser environment with environment variables
            if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
                return window.ENV[name];
            }
            return defaultValue;
        };

        return {
            api: {
                base_url: getEnvVar('API_BASE_URL', "https://your-api-gateway.amazonaws.com/Prod/register"),
                timeout: parseInt(getEnvVar('API_TIMEOUT', '30000')),
                retry_attempts: parseInt(getEnvVar('API_RETRY_ATTEMPTS', '3'))
            },
            twilio: {
                account_sid: getEnvVar('TWILIO_ACCOUNT_SID', "YOUR_TWILIO_ACCOUNT_SID"),
                verify_service_sid: getEnvVar('TWILIO_VERIFY_SERVICE_SID', "YOUR_TWILIO_VERIFY_SERVICE_SID"),
                verification_api_url: getEnvVar('TWILIO_VERIFICATION_API_URL', "https://your-verification-api.amazonaws.com/Prod/send-verification")
            },
            dashboard: {
                refresh_interval: parseInt(getEnvVar('DASHBOARD_REFRESH_INTERVAL', '30000')),
                chart_animation_duration: parseInt(getEnvVar('DASHBOARD_CHART_ANIMATION_DURATION', '1000')),
                default_time_range: getEnvVar('DASHBOARD_DEFAULT_TIME_RANGE', "3m")
            },
            patient: {
                default_patient_id: getEnvVar('PATIENT_DEFAULT_ID', "sarah_chen"),
                data_update_frequency: parseInt(getEnvVar('PATIENT_DATA_UPDATE_FREQUENCY', '60000'))
            },
            ui: {
                theme: getEnvVar('UI_THEME', "light"),
                language: getEnvVar('UI_LANGUAGE', "en"),
                timezone: getEnvVar('UI_TIMEZONE', "UTC")
            }
        };
    }

    get(path) {
        if (!this.config) {
            console.warn('Configuration not loaded yet. Call loadConfig() first.');
            return null;
        }

        const keys = path.split('.');
        let value = this.config;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    }
}

// Global configuration instance
window.AppConfig = new ConfigLoader(); 