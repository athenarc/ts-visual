package eu.more2020.visual.repository;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import eu.more2020.visual.config.ApplicationProperties;
import eu.more2020.visual.domain.Connection;
import eu.more2020.visual.web.rest.DatasetResource;

@Repository
public class ConnectionRepositoryImpl implements ConnectionRepository {
    
    private final Logger log = LoggerFactory.getLogger(DatasetResource.class);
    private final ApplicationProperties applicationProperties;

    public ConnectionRepositoryImpl(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public List<Connection> saveConnection(Connection connection) throws Exception {
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        List<Connection> json = new ArrayList<Connection>();
        File connectionFile = new File(applicationProperties.getWorkspacePath(), "connection.json");
        if(!connectionFile.exists() && !connectionFile.isDirectory()) {
            FileWriter fw = new FileWriter(connectionFile);
            json.add(connection);
            mapper.writeValue(fw, json);
            fw.close();
        } else {
            FileReader fr = new FileReader(connectionFile);
            json = mapper.readValue(fr, new TypeReference<List<Connection>>() {});
            json.add(connection);
            FileWriter fw = new FileWriter(connectionFile);
            mapper.writeValue(fw, json);
            fr.close();
        }
        return json; 
    }

    @Override
    public List<Connection> getConnection(String connectionName) throws Exception {
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        File connectionFile = new File(applicationProperties.getWorkspacePath(), "connection.json");
        FileReader fr = new FileReader(connectionFile);
        List<Connection> connections = mapper.readValue(fr, new TypeReference<ArrayList<Connection>>() {});
        connections.removeIf(al -> !al.getName().equals(connectionName));
        fr.close();
        return connections;
    }

    @Override
    public List<Connection> getAllConnections() throws Exception {
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        File connectionFile = new File(applicationProperties.getWorkspacePath(), "connection.json");
        FileReader fr = new FileReader(connectionFile);
        List<Connection> connections = mapper.readValue(fr, new TypeReference<ArrayList<Connection>>() {});
        fr.close();
        return connections;
    }
    
    @Override
    public List<Connection> deleteConnection(String connectionName) throws Exception {
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        File connectionFile = new File(applicationProperties.getWorkspacePath(), "connection.json");
        FileReader fr = new FileReader(connectionFile);
        List<Connection> connections = mapper.readValue(fr, new TypeReference<ArrayList<Connection>>() {});
        connections.removeIf(al -> al.getName().equals(connectionName));
        connections.forEach(alz -> System.out.println(alz.getName()));
        FileWriter fw = new FileWriter(connectionFile);
        mapper.writeValue(fw, connections);
        fr.close();
        fw.close();
        return connections;
    }
}
