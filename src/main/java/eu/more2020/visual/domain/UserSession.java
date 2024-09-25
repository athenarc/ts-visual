package eu.more2020.visual.domain;

import gr.imsi.athenarc.visual.middleware.domain.DatabaseConnection;

public class UserSession {
    private String sessionId;
    private DatabaseConnection databaseConnection;
    private String host;
    private String port;
    private String username;
    private String password;
    private String databaseName;

    public UserSession() {
    }
    public UserSession(String host, String port, String username, String password, String databaseName) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.databaseName = databaseName;
    }
    public String getSessionId() {
        return sessionId;
    }
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    public DatabaseConnection getDatabaseConnection() {
        return databaseConnection;
    }
    public void setDatabaseConnection(DatabaseConnection databaseConnection) {
        this.databaseConnection = databaseConnection;
    }
    public String getHost() {
        return host;
    }
    public void setHost(String host) {
        this.host = host;
    }
    public String getPort() {
        return port;
    }
    public void setPort(String port) {
        this.port = port;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getDatabaseName() {
        return databaseName;
    }
    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }
}