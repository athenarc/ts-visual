package eu.more2020.visual.domain;

public class DbConnector {

    String name;
    String type;
    String host;
    String port;
    String username;
    String password;
    String database;
    
    public String getName() {
        return name;
    }

    public String getType() {
        return this.type;
    }

    public String getHost() {
        return this.host;
    }
    public String getPort() {
        return this.port;
    }
    public String getUsername() {
        return this.username;
    }
    public String getPassword() {
        return this.password;
    }

    public String getDatabase() {
        return this.database;
    }


    public DbConnector() {}

    public DbConnector(String name,String type, String host, String port, String username, String password, String database) {
        this.name = name;
        this.type = type;
        this.host = host;
        this.port = port;
        this.username = username;
        this. password = password;
        this.database = database;
    }
}
