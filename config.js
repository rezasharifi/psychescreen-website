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
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
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
        return {
            api: {
                base_url: "https://x.com/api",
                timeout: 30000,
                retry_attempts: 3
            },
            dashboard: {
                refresh_interval: 30000,
                chart_animation_duration: 1000,
                default_time_range: "3m"
            },
            patient: {
                default_patient_id: "sarah_chen",
                data_update_frequency: 60000
            },
            ui: {
                theme: "light",
                language: "en",
                timezone: "UTC"
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