package eu.more2020.visual.repository;
import eu.more2020.visual.domain.DbColumns;
import eu.more2020.visual.domain.DbConnector;
import eu.more2020.visual.domain.SchemaInfo;
import eu.more2020.visual.domain.SchemaMeta;
import eu.more2020.visual.domain.Sample;
import gr.imsi.athenarc.visual.middleware.datasource.QueryExecutor.QueryExecutor;
import gr.imsi.athenarc.visual.middleware.domain.DatabaseConnection;
import gr.imsi.athenarc.visual.middleware.domain.Dataset.AbstractDataset;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Repository for the Dataset entity.
 */
@SuppressWarnings("unused")
public interface DatasetRepository {

    String DATASETS_CACHE = "datasets";

    List<AbstractDataset> findAll();

    List<Object[]> findSample(String sessionId, String id, QueryExecutor queryExecutor) throws SQLException;
    
    Optional<SchemaMeta> findSchema (String sessionId, DatabaseConnection connection, String schema, QueryExecutor queryExecutor) throws SQLException, IOException;

    Optional<SchemaMeta> findUserStudySchema(String sessionId, String schema) throws IOException;

    @Cacheable(cacheNames = DATASETS_CACHE)
    Optional<AbstractDataset> findById(String sessionId, String id, String schema, DatabaseConnection databaseConnection) throws IOException, SQLException;

    AbstractDataset save(AbstractDataset dataset) throws IOException;
    
    SchemaInfo updateSchemaInfoColumns(String sessionId, String id, DbColumns dbColumns);

    void deleteById(String id);

    void deleteAll(String sessionId);

    List<String> getColumnNames(String id, QueryExecutor queryExecutor);

}