package eu.more2020.visual.domain;

public class DbConfig {
    String url;
    String port;
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getPort() {
        return port;
    }
    public void setPort(String port) {
        this.port = port;
    }
    public DbConfig() {
    }
    public DbConfig(String url, String port) {
        this.url = url;
        this.port = port;
    }

    
}
