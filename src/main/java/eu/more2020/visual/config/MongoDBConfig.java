package eu.more2020.visual.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoDBConfig extends AbstractMongoClientConfiguration {

    @Value("${application.dbSettings}")
    private String configFile;
    private Properties properties = new Properties();

    @Override
    protected String getDatabaseName() {
        loadProperties();
        return properties.getProperty("mongo_db_name");
    }

    @Override
    public com.mongodb.client.MongoClient mongoClient() {
        loadProperties();
        return com.mongodb.client.MongoClients.create(properties.getProperty("mongo_uri"));
    }

    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }

    private void loadProperties() {
        try {
            FileInputStream inputStream = new FileInputStream(configFile);
            properties.load(inputStream);
        } catch (IOException e) {
            throw new RuntimeException("Error loading configuration file", e);
        }
    }
}

