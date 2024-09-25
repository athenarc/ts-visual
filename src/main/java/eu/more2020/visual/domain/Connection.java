package eu.more2020.visual.domain;

public class Connection {
    private String name;
    private String type;
    private String host;
    private String port;
    private String username;
    private String password;
    private String database;

    public Connection(String name, String type, String host, String port, String username, String password,
            String database) {
        this.name = name;
        this.type = type;
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }


    public Connection() {
    }


    public String getDatabase() {
        return database;
    }
    public void setDatabase(String database) {
        this.database = database;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
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
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Connection: " + name;
    }
    
}
