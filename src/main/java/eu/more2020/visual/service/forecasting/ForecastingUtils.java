package eu.more2020.visual.service.forecasting;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.bson.Document;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.InfluxDBClientOptions;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApi;
import com.influxdb.client.WriteOptions;
import com.influxdb.client.write.Point;
import com.influxdb.exceptions.InfluxException;
import com.influxdb.query.FluxTable;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoClient;

import eu.more2020.visual.domain.Forecasting.DBs.BEZ2;
import eu.more2020.visual.domain.Forecasting.DBs.DataBasesConfig;
import eu.more2020.visual.domain.Forecasting.DBs.Meta;
import eu.more2020.visual.repository.MetaRepository;
import io.reactivex.rxjava3.core.BackpressureOverflowStrategy;

@Service
public class ForecastingUtils {

    private final Logger log = LoggerFactory.getLogger(ForecastingUtils.class);

    @Autowired
    private MetaRepository metaRepository;
    private DataBasesConfig dbConfig = new DataBasesConfig();
    private Properties properties = new Properties();

    @Value("${application.workspacePath}")
    private String workspacePath;

    @Value("${application.dbSettings}")
    private String dbSettings;

    public ForecastingUtils(MetaRepository metaRepository, Properties properties, DataBasesConfig dbConfig) {
        this.metaRepository = metaRepository;
        this.dbConfig = dbConfig;
        this.properties = properties;
    }

    public ResponseEntity<List<Meta>> deleteForecastingModel(String modelName) {
        long deletedCount = metaRepository.deleteByModelName(modelName);
        if (deletedCount > 0) {
            List<Meta> remainingModels = metaRepository.findAllByModelNameNot(modelName);

            File directory = new File("/data/1/models");
            if (directory.exists() && directory.isDirectory()) {
                Arrays.stream(directory.listFiles())
                        .filter(file -> getFileNameWithoutExtension(file.getName()).equals(modelName))
                        .forEach(file -> {
                            if (file.delete()) {
                                log.debug("File deleted successfully: " + file.getName());
                            } else {
                                log.debug("Failed to delete the file: " + file.getName());
                            }
                        });
            } else {
                log.debug("The specified directory does not exist or is not a directory.");
            }
            return ResponseEntity.ok().body(remainingModels);
        } else {
            // Handle the case when no documents were deleted
            return ResponseEntity.notFound().build();
        }
    }

    private static String getFileNameWithoutExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex != -1 ? fileName.substring(0, lastDotIndex) : fileName;
    }

    public String dbsInitialization () {
        try {
            FileInputStream inputStream = new FileInputStream(dbSettings);
            properties.load(inputStream);
            dbConfig.setBucket(properties.getProperty("bucket"));
            dbConfig.setKind(properties.getProperty("kind"));
            dbConfig.setOrg(properties.getProperty("org"));
            dbConfig.setToken(properties.getProperty("token"));
            dbConfig.setMongo_uri(properties.getProperty("mongo_uri"));
            dbConfig.setMongo_db_name(properties.getProperty("mongo_db_name"));
            dbConfig.setMongo_user_name(properties.getProperty("mongo_user_name"));
            dbConfig.setMongo_user_password(properties.getProperty("mongo_user_password"));
            dbConfig.setInflux_url(properties.getProperty("influx_url"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.submit(() -> mongoInit(dbConfig));
        executorService.submit(() -> influxInit(dbConfig));
        return "done";
    }

    // public List<Point> getPoints() {
    //     log.debug("Parsing CSV file...");
    //     long startTime = System.currentTimeMillis();
    //     Path pathInput = Paths.get(workspacePath + "/beico/beico11.csv");
    //     List<Point> list = List.of(); // Default to empty list.
    //     try {
    //         int initialCapacity = (int) Files.lines(pathInput).count();
    //         list = new ArrayList<>(initialCapacity);

    //         BufferedReader reader = Files.newBufferedReader(pathInput);
    //         Iterable<CSVRecord> records = CSVFormat.RFC4180.withFirstRecordAsHeader().parse(reader);
    //         for (CSVRecord record : records) {
    //             String format = "yyyy-MM-dd HH:mm:ss";
    //             SimpleDateFormat sdf = new SimpleDateFormat(format);
    //             String dt = record.get("datetime");
    //             Date date = sdf.parse(dt);
    //             Instant datetime = date.toInstant();
    //             list.add(new Beico(
    //                 datetime,
    //                 Double.parseDouble(record.get("Grd_Prod_Pwr_avg")),
    //                 Double.parseDouble(record.get("Amb_Temp_avg")),
    //                 Double.parseDouble(record.get("Amb_WindSpeed_avg")),
    //                 Double.parseDouble(record.get("Grd_Prod_Pwr_min")),
    //                 Double.parseDouble(record.get("Amb_Temp_min")),
    //                 Double.parseDouble(record.get("Amb_WindSpeed_min")),
    //                 Double.parseDouble(record.get("Grd_Prod_Pwr_max")),
    //                 Double.parseDouble(record.get("Amb_Temp_max")),
    //                 Double.parseDouble(record.get("Amb_WindSpeed_max")),
    //                 Double.parseDouble(record.get("Grd_Prod_Pwr_std")),
    //                 Double.parseDouble(record.get("Amb_WindSpeed_std")),
    //                 Double.parseDouble(record.get("Amb_WindDir_Abs_avg")),
    //                 Double.parseDouble(record.get("label")),
    //                 Double.parseDouble(record.get("MeanWindSpeedUID_10.0m")),
    //                 Double.parseDouble(record.get("DirectionUID_10.0m")),
    //                 Double.parseDouble(record.get("MeanWindSpeedUID_100.0m")),
    //                 Double.parseDouble(record.get("DirectionUID_100.0m"))
    //             ).toPoint());
    //         }
    //     } catch (IOException | ParseException e) {
    //         e.printStackTrace();
    //     }
    //     long endTime = System.currentTimeMillis();
    //     double elapsedTimeSeconds = (endTime - startTime) / 1000.0;
    //     log.debug("CSV parsing took: " + elapsedTimeSeconds + " seconds");

    //     return list;
    // }

    public List<Point> getPoints() {
        log.debug("Parsing CSV file...");
        long startTime = System.currentTimeMillis();
        Path pathInput = Paths.get(workspacePath + "/wind/BEZ2.csv");
        List<Point> list = List.of(); // Default to empty list.
        try {
            int initialCapacity = (int) Files.lines(pathInput).count();
            list = new ArrayList<>(initialCapacity);

            BufferedReader reader = Files.newBufferedReader(pathInput);
            Iterable<CSVRecord> records = CSVFormat.RFC4180.withFirstRecordAsHeader().parse(reader);
            for (CSVRecord record : records) {
                String format = "yyyy-MM-dd HH:mm:ss";
                SimpleDateFormat sdf = new SimpleDateFormat(format);
                String dt = record.get("datetime");
                Date date = sdf.parse(dt);
                Instant datetime = date.toInstant();
                Double wind_speed = Double.parseDouble(record.get("wind_speed"));
                Double pitch_angle = Double.parseDouble(record.get("pitch_angle"));
                Double rotor_speed = Double.parseDouble(record.get("rotor_speed"));
                Double active_power = Double.parseDouble(record.get("active_power"));
                Double cos_nacelle_dir = Double.parseDouble(record.get("cos_nacelle_dir"));
                Double sin_nacelle_dir = Double.parseDouble(record.get("sin_nacelle_dir"));
                Double cos_wind_dir = Double.parseDouble(record.get("cos_wind_dir"));
                Double sin_wind_dir = Double.parseDouble(record.get("sin_wind_dir"));
                Double cor_nacelle_direction = Double.parseDouble(record.get("cor_nacelle_direction"));
                Double cor_wind_direction = Double.parseDouble(record.get("cor_wind_direction"));

                Point point = new BEZ2(datetime, wind_speed, pitch_angle, rotor_speed,
                active_power, cos_nacelle_dir, sin_nacelle_dir,
                cos_wind_dir, sin_wind_dir, cor_nacelle_direction,
                cor_wind_direction).toPoint();
                list.add(point);
            }
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }

        long endTime = System.currentTimeMillis();
        double elapsedTimeSeconds = (endTime - startTime) / 1000.0;
        log.debug("CSV parsing took: " + elapsedTimeSeconds + " seconds");

        return list;
    }

    public void influxInit(DataBasesConfig dbCon) {
        InfluxDBClientOptions options = InfluxDBClientOptions
                .builder()
                .url(dbCon.getInflux_url())
                .org(dbCon.getOrg())
                .bucket(dbCon.getBucket())
                .authenticateToken(dbCon.getToken().toCharArray())
                .build();

        InfluxDBClient client = InfluxDBClientFactory.create(options);
        QueryApi queryApi = client.getQueryApi();

        String query = String.format(
                "from(bucket:\"%s\") |> range(start: 0) |> filter(fn: (r) => r._measurement == \"%s\") |> limit(n: 1)",
                dbCon.getBucket(), dbCon.getKind());

        List<FluxTable> tables = queryApi.query(query);
        if (tables.isEmpty()) {
            WriteApi writeApi = client.makeWriteApi(WriteOptions.builder()
        .batchSize(5000)
        .flushInterval(1000)
        .backpressureStrategy(BackpressureOverflowStrategy.DROP_OLDEST)
        .retryInterval(5000)
        .build());

        try {
        log.debug("Started influxDB data injection");
        long startTime = System.currentTimeMillis();
        writeApi.writePoints(getPoints());
        long endTime = System.currentTimeMillis();
        double elapsedTimeSeconds = (endTime - startTime) / 1000.0;
        log.debug("Influx data injection took: " + elapsedTimeSeconds + " seconds");
        log.debug("Influx: completed initialization");
        } catch (InfluxException e) {
        e.printStackTrace();
        }
        } else {
            log.debug("Influx: Initialization has already been completed");
        }
        client.close();
    }

    public void mongoInit(DataBasesConfig dbCon) {
        // Create connection string
        ConnectionString connString = new ConnectionString(dbCon.getMongo_uri());
        // Create MongoClientSettings
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connString)
                .build();

        // Create MongoClient
        try (MongoClient mongoClient = MongoClients.create(settings)) {
            // Get the admin database
            MongoDatabase adminDatabase = mongoClient.getDatabase("admin");

            // Check if the database exists
            boolean databaseExists = mongoClient.listDatabaseNames().into(new ArrayList<>())
                    .contains(dbCon.getMongo_db_name());
            if (!databaseExists) {
                initializeMongoDatabase(mongoClient, dbCon);
            }

            // Check if the user exists
            Document userFilter = new Document("user", dbCon.getMongo_user_name());
            boolean userExists = adminDatabase.getCollection("system.users").countDocuments(userFilter) > 0;
            if (!userExists) {
                initializeMongoUser(mongoClient, dbCon);
            }
            mongoClient.close();
        }
    }

    public void initializeMongoUser(MongoClient mongoClient, DataBasesConfig dbCon) {

        MongoDatabase targetDatabase = mongoClient.getDatabase(dbCon.getMongo_db_name());
        // Create the user
        Document createUserCommand = new Document("createUser", dbCon.getMongo_user_name())
                .append("pwd", dbCon.getMongo_user_password())
                .append("roles", Arrays.asList(
                        new Document("role", "readWrite").append("db", dbCon.getMongo_db_name()),
                        new Document("role", "dbAdmin").append("db", dbCon.getMongo_db_name())));

        Document createUserResult = targetDatabase.runCommand(createUserCommand);
        if (createUserResult.getDouble("ok") == 1.0) {
            log.debug("Mongo: User created successfully.");
        } else {
            log.debug("Mongo: Failed to create user.");
        }
    }

    public void initializeMongoDatabase(MongoClient mongoClient, DataBasesConfig dbCon) {

        MongoDatabase targetDatabase = mongoClient.getDatabase(dbCon.getMongo_db_name());

        Document createDatabaseCommand = new Document("create", dbCon.getMongo_db_name());
        Document databaseCreation = targetDatabase.runCommand(createDatabaseCommand);
        targetDatabase.createCollection("meta");
        targetDatabase.getCollection("more").drop();

        if (databaseCreation.getDouble("ok") == 1.0) {
            log.debug("Mongo: Database created successfully.");
        } else {
            log.debug("Mongo: Failed to create Database.");
        }
    }

}
