package eu.more2020.visual.repository;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

import cfjd.com.fasterxml.jackson.core.exc.StreamReadException;
import cfjd.com.fasterxml.jackson.core.exc.StreamWriteException;
import cfjd.com.fasterxml.jackson.databind.DatabindException;
import eu.more2020.visual.domain.Connection;
import io.jsonwebtoken.io.IOException;

/**
 * Repository for the Connection entity.
 */
@SuppressWarnings("unused")
public interface ConnectionRepository {
    
    String DATASETS_CACHE = "datasets";

    List<Connection> saveConnection(Connection connection) throws Exception;
    
    List<Connection> getConnection(String connectionName) throws Exception;

    List<Connection> getAllConnections() throws Exception;

    List<Connection> deleteConnection(String connectionName) throws Exception;
}
