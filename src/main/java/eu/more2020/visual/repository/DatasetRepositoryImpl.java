package eu.more2020.visual.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.more2020.visual.config.ApplicationProperties;
import eu.more2020.visual.domain.*;
import gr.imsi.athenarc.visual.middleware.datasource.QueryExecutor.QueryExecutor;
import gr.imsi.athenarc.visual.middleware.datasource.QueryExecutor.InfluxDBQueryExecutor;
import gr.imsi.athenarc.visual.middleware.datasource.QueryExecutor.SQLQueryExecutor;
import gr.imsi.athenarc.visual.middleware.domain.TableInfo;
import gr.imsi.athenarc.visual.middleware.domain.DatabaseConnection;
import gr.imsi.athenarc.visual.middleware.domain.Dataset.*;
import gr.imsi.athenarc.visual.middleware.domain.InfluxDB.InfluxDBConnection;
import gr.imsi.athenarc.visual.middleware.util.io.SerializationUtilities;

import org.h2.engine.Database;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.io.*;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;

@Repository
public class DatasetRepositoryImpl implements DatasetRepository {

    private final ApplicationProperties applicationProperties;

    private final Logger log = LoggerFactory.getLogger(DatasetRepositoryImpl.class);

    private Map<String, AbstractDataset> datasets = new HashMap<String, AbstractDataset>();

    private Map<String, SchemaMeta> schemasMeta = new HashMap<String,SchemaMeta>();

    @Value("${application.timeFormat}")
    private String timeFormat;

    public DatasetRepositoryImpl(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override 
    public List<AbstractDataset> findAll() {
        List<AbstractDataset> allDatasets = new ArrayList<AbstractDataset>(datasets.values());
        log.debug(allDatasets.toString());
        return allDatasets;
    }

    @Override
    public Optional<SchemaMeta> findSchema(String sessionId, DatabaseConnection connection, String schema, QueryExecutor queryExecutor) throws SQLException, IOException {
        Assert.notNull(sessionId, "Session ID must not be null!");
        SchemaMeta schemaMeta = new SchemaMeta();
        try {
            if(schemasMeta.containsKey(sessionId)) {
                if (!schemasMeta.get(sessionId).getName().equals(schema)) throw new IllegalArgumentException("Schema " + schema + "does not exist in session " + sessionId);
                schemaMeta = schemasMeta.get(sessionId);
            }
            else {
                List<SchemaInfo> schemaInfos = new ArrayList<SchemaInfo>();
                List<TableInfo> tableInfoArray = new ArrayList<TableInfo>();
                schemaMeta.setName(schema);
                schemaMeta.setType(connection.getType());
                if(connection instanceof InfluxDBConnection) schemaMeta.setIsTimeSeries(true);
                else schemaMeta.setIsTimeSeries(false);
                tableInfoArray = queryExecutor.getTableInfo();
                if (tableInfoArray.isEmpty()) throw new SQLException("No available data for schema " + schema);
                for (TableInfo tableInfo : tableInfoArray) {
                    SchemaInfo schemaInfo = new SchemaInfo();
                    schemaInfo.setId(tableInfo.getTable());
                    schemaInfo.setSchema(tableInfo.getSchema());
                    if (connection instanceof InfluxDBConnection) schemaInfo.setIsConfiged(true);
                    else schemaInfo.setIsConfiged(false);
                    schemaInfos.add(schemaInfo);
                }
                schemaMeta.setData(schemaInfos);
                schemasMeta.put(sessionId, schemaMeta);
            }
        } catch (Exception e) {
            throw e;
        }
        return Optional.ofNullable(schemaMeta);
    }

    @Override
    public Optional<SchemaMeta> findUserStudySchema(String sessionId, String schema) throws IOException {
        Assert.notNull(sessionId, "Session ID must not be null!");
        SchemaMeta schemaMeta = new SchemaMeta();
        if(schemasMeta.containsKey(sessionId)) schemaMeta = schemasMeta.get(sessionId);
        else {
            ObjectMapper mapper = new ObjectMapper();
            try {
                File metadataFile = new File(applicationProperties.getWorkspacePath() + "/more.meta.json");
                if (metadataFile.exists()) {
                    FileReader reader = new FileReader(metadataFile);
                    schemaMeta = mapper.readValue(reader, SchemaMeta.class);
                }
                log.debug("{}", schemaMeta);
                for (SchemaInfo schemaInfo : schemaMeta.getData()) schemaInfo.setIsConfiged(true);
                if (schemaMeta.getData().isEmpty()) throw new IOException("No available data.");
                schemasMeta.put(sessionId, schemaMeta);
            } catch(Exception e) {
                throw e;
            }
        }
        return Optional.ofNullable(schemaMeta);
    }

    @Override
    public AbstractDataset save(AbstractDataset dataset) throws IOException {
        Assert.notNull(dataset, "Dataset must not be null!");
        ObjectMapper mapper = new ObjectMapper();
        File metadataFile = new File(applicationProperties.getWorkspacePath(), dataset.getId() + ".meta.json");
        FileWriter writer = new FileWriter(metadataFile);
        mapper.writeValue(writer, AbstractDataset.class);
        return dataset;
    }



    @Override
    public List<Object[]> findSample(String sessionId, String id, QueryExecutor queryExecutor) throws SQLException {
        Assert.notNull(sessionId, "Session ID must not be null!");
        List<Object[]> resultList = new ArrayList<>();
        String schema = null;
        try {
            SchemaMeta schemaMeta = schemasMeta.get(sessionId);
            if (schemaMeta == null ) throw new SQLException("No available data.");
            for (SchemaInfo schemaInfo : schemaMeta.getData()) {
                if (schemaInfo.getId().equals(id)) {
                    schema = schemaInfo.getSchema();
                    break;
                }
            }
            resultList = queryExecutor.getSample(schema, id);
        } catch (Exception e) {
            throw e;
        }
        return resultList;
    }
    
    @Override
    public void deleteById(String id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void deleteAll(String sessionId) {
        if(!datasets.isEmpty()) datasets.clear();
        if(!schemasMeta.isEmpty()) schemasMeta.remove(sessionId);
    }

    @Override
    public Optional<AbstractDataset> findById(String sessionId, String id, String schema, DatabaseConnection databaseConnection) throws SQLException {
        Assert.notNull(id, "ID must not be null!");
        String datasetID = databaseConnection.getType() + "_" + id + "_" + schema;
        AbstractDataset dataset = null;
        if(datasets.containsKey(datasetID)) dataset = datasets.get(datasetID);
        else {
            try {
                SchemaMeta schemaMeta = schemasMeta.get(sessionId);
                if (schemaMeta == null ) throw new SQLException("No available data.");
                for(SchemaInfo schemaInfo : schemaMeta.getData()) {
                    if (schemaInfo.getId().equals(id)) {
                        dataset = createDBDataset(databaseConnection.getType(), schemaInfo, databaseConnection.getQueryExecutor());
                        datasets.put(datasetID, dataset);
                        break;
                    }
                }
            } catch (Exception e) {
                throw e;
            }
        }
        return Optional.ofNullable(dataset);
    }


    @Override
    public SchemaInfo updateSchemaInfoColumns(String sessionId, String id, DbColumns columns) {
        Assert.notNull(sessionId, "Session ID must not be null");
        SchemaMeta schemaMeta = schemasMeta.get(sessionId);
        for (SchemaInfo schemaInfo : schemaMeta.getData()) {
            if (schemaInfo.getId().equals(id)) {
                schemaInfo.setTimeCol(columns.getTimeCol());
                schemaInfo.setIdCol(columns.getIdCol());
                schemaInfo.setValueCol(columns.getValueCol());
                schemaInfo.setIsConfiged(columns.getIsConfiged());
                return schemaInfo;
            }
        }
        return null;
    }

    private AbstractDataset createDBDataset(String type, SchemaInfo schemaInfo, QueryExecutor queryExecutor) throws SQLException {
        AbstractDataset dataset = null;
        log.debug("creating new dataset {}", schemaInfo.getId());
        String p = "";
        switch (type) {
            case "jdbc":
                SQLQueryExecutor sqlQueryExecutor = (SQLQueryExecutor) queryExecutor;
                p = String.valueOf(Paths.get(applicationProperties.getWorkspacePath(), "postgres-" + schemaInfo.getId()));
                if (new File(p).exists()) dataset = (PostgreSQLDataset) SerializationUtilities.loadSerializedObject(p);
                else{
                    dataset = new PostgreSQLDataset(sqlQueryExecutor, schemaInfo.getId(), schemaInfo.getSchema(), schemaInfo.getId(), timeFormat, 
                                                schemaInfo.getTimeCol(),schemaInfo.getIdCol(), schemaInfo.getValueCol());
                    SerializationUtilities.storeSerializedObject(dataset, p);
                }
                break; 
            case "influx":
                InfluxDBQueryExecutor influxDBQueryExecutor = (InfluxDBQueryExecutor) queryExecutor;
                p = String.valueOf(Paths.get(applicationProperties.getWorkspacePath(), "influx-" + schemaInfo.getId()));
                if (new File(p).exists()) dataset = (InfluxDBDataset) SerializationUtilities.loadSerializedObject(p);
                else{
                    dataset = new InfluxDBDataset(influxDBQueryExecutor, schemaInfo.getId(), schemaInfo.getSchema(), schemaInfo.getId(), timeFormat, schemaInfo.getTimeCol());
                    SerializationUtilities.storeSerializedObject(dataset, p);
                }
                break;
            default:
                break;
        }
        return dataset;
    }

    public List<String> getColumnNames(String id, QueryExecutor queryExecutor) {
        List<String> columnNames = new ArrayList<>();
        try {
            columnNames = queryExecutor.getColumns(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return columnNames;
    }
}
