package eu.more2020.visual.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to MoreVis.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {
    String workspacePath;
    String delimiter;
    String timeFormat;
    String toolHost;
    int toolPort;
    String forecastHost;
    int forecastPort;

    public String getWorkspacePath() {
        return workspacePath;
    }

    public void setWorkspacePath(String workspacePath) {
        this.workspacePath = workspacePath;
    }

    public String getDelimiter() {
        return delimiter;
    }

    public void setDelimiter(String delimiter) {
        this.delimiter = delimiter;
    }

    public String getTimeFormat() {
        return timeFormat;
    }

    public void setTimeFormat(String timeFormat) {
        this.timeFormat = timeFormat;
    }

    public String getToolHost() {
        return toolHost;
    }

    public int getToolPort() {
        return toolPort;
    }

    public void setToolHost(String toolHost) {
        this.toolHost = toolHost;
    }

    public void setToolPort(int toolPort) {
        this.toolPort = toolPort;
    }
    public String getForecastHost() {
        return forecastHost;
    }

    public void setForecastHost(String forecastHost) {
        this.forecastHost = forecastHost;
    }
    
    public int getForecastPort() {
        return forecastPort;
    }

    public void setForecastPort(int forecastPort) {
        this.forecastPort = forecastPort;
    }

}
