package eu.more2020.visual.web.rest;

import eu.more2020.visual.domain.*;
import gr.imsi.athenarc.visual.middleware.datasource.QueryExecutor.QueryExecutor;
import gr.imsi.athenarc.visual.middleware.domain.*;
import gr.imsi.athenarc.visual.middleware.domain.InfluxDB.InfluxDBConnection;
import gr.imsi.athenarc.visual.middleware.domain.PostgreSQL.JDBCConnection;
import gr.imsi.athenarc.visual.middleware.domain.Dataset.AbstractDataset;
import gr.imsi.athenarc.visual.middleware.domain.Query.Query;
import eu.more2020.visual.repository.AlertRepository;
import eu.more2020.visual.repository.DatasetRepository;
import eu.more2020.visual.repository.FileHandlingRepository;
import eu.more2020.visual.service.CsvDataService;
import eu.more2020.visual.service.DataService;
import eu.more2020.visual.service.SessionService;
import eu.more2020.visual.service.DatabaseConnectionService;
import eu.more2020.visual.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link AbstractDataset}.
 */
@RestController
@RequestMapping("/api")
public class DatasetResource {
    private static final String ENTITY_NAME = "dataset";
    private final Logger log = LoggerFactory.getLogger(DatasetResource.class);
    private final DatasetRepository datasetRepository;
    private final DataService dataService;
    private final DatabaseConnectionService databaseConnectionService;

    @Autowired
    private final SessionService sessionService;
    @Autowired
    private final CsvDataService csvDataService;

    private final FileHandlingRepository fileHandlingRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Value("${application.workspacePath}")
    private String workspacePath;

    public DatasetResource(DatasetRepository datasetRepository,
                           AlertRepository alertRepository,
                           CsvDataService csvDataService,
                           SessionService sessionService,
                           DatabaseConnectionService databaseConnectionService,
                           DataService dataService, FileHandlingRepository fileHandlingRepository) {
        this.datasetRepository = datasetRepository;
        this.sessionService = sessionService;
        this.databaseConnectionService = databaseConnectionService;
        this.csvDataService = csvDataService;
        this.dataService = dataService;
        this.fileHandlingRepository = fileHandlingRepository;
    }

    /**
     * {@code POST  /datasets} : Create a new dataset.
     *
     * @param dataset the dataset to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataset, or with status {@code 400 (Bad Request)} if the dataset has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/datasets")
    public ResponseEntity<AbstractDataset> createDataset(@Valid @RequestBody AbstractDataset dataset) throws URISyntaxException, IOException {
        log.debug("REST request to save Dataset : {}", dataset);
        if (dataset.getId() != null) {
            throw new BadRequestAlertException("A new dataset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AbstractDataset result = datasetRepository.save(dataset);
        return ResponseEntity.created(new URI("/api/datasets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /datasets} : Updates an existing dataset.
     *
     * @param dataset the dataset to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataset,
     * or with status {@code 400 (Bad Request)} if the dataset is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataset couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/datasets")
    public ResponseEntity<AbstractDataset> updateDataset(@Valid @RequestBody AbstractDataset dataset) throws URISyntaxException, IOException {
        log.debug("REST request to update Dataset : {}", dataset);
        if (dataset.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AbstractDataset result = datasetRepository.save(dataset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dataset.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /datasets} : get all the datasets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of datasets in body.
     */
    @GetMapping("/datasets")
    public List<AbstractDataset> getAllDatasets() {
        log.debug("REST request to get all Datasets");
        return datasetRepository.findAll();
    }

    /**
     * {@code DELETE  /datasets/:id} : delete the "id" dataset.
     *
     * @param id the id of the dataset to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/datasets/{id}")
    public ResponseEntity<Void> deleteDataset(@PathVariable String id) {
        log.debug("REST request to delete Dataset : {}", id);
        datasetRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /datasets/:schema/:id} : get the "id" dataset from "schema" schema.
     * @param schema the name of the schema
     * @param id the id of the dataset to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataset, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/datasets/{schema}/{id}")
    public ResponseEntity<AbstractDataset> getDataset(@RequestParam String sessionId, @PathVariable String schema, @PathVariable String id) throws IOException, SQLException {
        log.debug("REST request to get Dataset : {}/{}", schema, id);
        Optional<AbstractDataset> dataset = null;
        UserSession userSession = sessionService.getSession(sessionId);
        if (userSession != null) {
            DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
            dataset = datasetRepository.findById(sessionId, id, schema, databaseConnection);
            log.debug(dataset.toString());
        }
        else return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        return ResponseUtil.wrapOrNotFound(dataset);
    }

    /**
     * POST executeQuery
     */
    @PostMapping("/datasets/{schema}/{id}/query")
    public ResponseEntity<QueryResults> executeQuery(@RequestParam String sessionId, @PathVariable String schema, @PathVariable String id, @Valid @RequestBody Query query) throws IOException, SQLException {
        log.debug("REST request to execute Query: {}", query);
        log.debug("{}", sessionId);
        log.debug("{}", sessionService.getActiveSessions());
        UserSession userSession = sessionService.getSession(sessionId);
        Optional<QueryResults> queryResultsOptional = null;
        if (userSession != null) {
            // Access database connection details from the session
            DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
            queryResultsOptional = datasetRepository.findById(sessionId, id, schema, databaseConnection).map(dataset -> {
                return dataService.executeQuery(databaseConnection, dataset, query);
            });
        } 
        else return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        return ResponseUtil.wrapOrNotFound(queryResultsOptional);
        
    }

    @GetMapping("/datasets/{schema}/sample")
    public List<Object[]> getSample(@RequestParam String sessionId, @PathVariable String schema) throws IOException, SQLException {
        log.debug("REST request to get Sample File");
        UserSession userSession = sessionService.getSession(sessionId);
        if (userSession != null) {
            DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
            QueryExecutor queryExecutor = databaseConnection.getQueryExecutor();
            return datasetRepository.findSample(sessionId, schema, queryExecutor);
        }
        else return new ArrayList<>();
    }

    @GetMapping("/datasets/metadata/{schema}")
    public ResponseEntity<Optional<SchemaMeta>> getSchemaMetadata(@RequestParam String sessionId, @PathVariable String schema) {
        log.debug("Rest request to get user study schema metadata for {} with sessionId {}", schema, sessionId);
        try {
            UserSession userSession = sessionService.getSession(sessionId);
            if (userSession != null) {
                DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
                QueryExecutor queryExecutor = databaseConnection.getQueryExecutor();
                Optional<SchemaMeta> schemaMeta = datasetRepository.findSchema(sessionId, databaseConnection, schema, queryExecutor);
                return new ResponseEntity<Optional<SchemaMeta>>(schemaMeta, HttpStatus.OK);
            }
            else return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user-study/metadata/{schema}")
    public ResponseEntity<Optional<SchemaMeta>> getUserStudySchemaMetadata (@RequestParam String sessionId, @PathVariable String schema) throws IOException {
        log.debug("Rest request to get user study schema metadata for {} with sessionId {}", schema, sessionId);
        try {
            Optional<SchemaMeta> schemaMeta = datasetRepository.findUserStudySchema(sessionId, schema);
            return new ResponseEntity<Optional<SchemaMeta>>(schemaMeta, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/datasets/metadata/columns/{schema}/{id}")
    public ResponseEntity<List<String>> getColumnNames(@RequestParam String sessionId, @PathVariable String schema, @PathVariable String id) throws SQLException {
        log.debug("Rest request to get column names for table {}", id);
        List<String> columnNames = new ArrayList<>();
        try {
            UserSession userSession = sessionService.getSession(sessionId);
            if (userSession != null) {
                DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
                QueryExecutor queryExecutor = databaseConnection.getQueryExecutor();
                columnNames = datasetRepository.getColumnNames(id, queryExecutor);
                return new ResponseEntity<List<String>>(columnNames, HttpStatus.OK);
            }
            else return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/datasets/resetCache/{schema}/{id}")
    public ResponseEntity<Boolean> resetCache(@PathVariable String schema, @PathVariable String id) throws SQLException {
        log.debug("Rest request to reset cache for table {}", id);
        try {
            dataService.deleteCache(id);
            // QueryExecutor queryExecutor = databaseConnection.getQueryExecutor();            
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * {@code PUT  /datasets/metadata/columns/:schema/:id} : set the corresponding time, id and value columns of a table
     * @param id
     * @param dbColumns
     * @return a new schema info with the updated column fields
     */
    @PutMapping("/datasets/metadata/columns/{schema}/{id}")
    public ResponseEntity<SchemaInfo> updateSchemaInfoColumnNames(@RequestParam String sessionId, @PathVariable String schema, @PathVariable String id, @Valid @RequestBody DbColumns dbColumns) {
        log.debug("Rest request to update columns of table with id {} on schema {} with columns {}", id, dbColumns.toString());
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "NULL_ID");
        }
        SchemaInfo result = datasetRepository.updateSchemaInfoColumns(sessionId, id, dbColumns);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.toString()))
            .body(result);
    }

    @PostMapping("/database/connect") 
    public ResponseEntity<String> connector(@RequestBody DbConnector dbConnector) throws SQLException {
        log.debug("Rest request to connect to db");
        UserSession userSession = sessionService.createSession(dbConnector.getHost(), 
                                                               dbConnector.getPort(), 
                                                               dbConnector.getUsername(), 
                                                               dbConnector.getPassword(), 
                                                               dbConnector.getDatabase());
        
        DatabaseConnection databaseConnection = null;
        String url = null;
        switch (dbConnector.getType()) {
            case "postgres":
                url = "jdbc:postgresql://" + dbConnector.getHost() + ":" + dbConnector.getPort() + "/" + dbConnector.getDatabase();
                databaseConnection = new JDBCConnection(url, dbConnector.getUsername(), dbConnector.getPassword());
                break;
            case "influx":
                url = "http://" + dbConnector.getHost() + ":" + dbConnector.getPort();
                databaseConnection = new InfluxDBConnection(url, dbConnector.getUsername(), dbConnector.getPassword(), dbConnector.getDatabase());
                break;
            default:
                break;
        }
        try {
            databaseConnectionService.connectToDatabase(userSession, databaseConnection);
            return ResponseEntity.ok(userSession.getSessionId());
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/database/disconnect")
    public ResponseEntity<Boolean> disconnector(@RequestParam String sessionId) throws SQLException {
        log.debug("Rest request to close connection for session {}", sessionId);
        sessionId = sessionId.replace("=", "");
        UserSession userSession = sessionService.getSession(sessionId);
        if (userSession != null) {
            DatabaseConnection databaseConnection = userSession.getDatabaseConnection();
            datasetRepository.deleteAll(sessionId);
            //dataService.deleteCaches();
            //if(databaseConnection != null) databaseConnection.closeConnection();
            sessionService.removeSession(sessionId);
        }
        return new ResponseEntity<Boolean>(true, HttpStatus.OK);
    }
    
}
