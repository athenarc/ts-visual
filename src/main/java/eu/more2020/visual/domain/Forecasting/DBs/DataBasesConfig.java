package eu.more2020.visual.domain.Forecasting.DBs;

import org.springframework.stereotype.Component;

@Component
public class DataBasesConfig {

    private String influx_url;

    private String token;

    private String bucket;

    private String kind;

    private String org;

    private String mongo_uri;

    private String mongo_db_name;

    private String mongo_user_name;

    private String mongo_user_password;

    public DataBasesConfig(String influx_url, String token, String bucket, String org, String mongo_uri, String mongo_db_name, String kind,
            String mongo_user_name, String mongo_user_password) {
        this.influx_url = influx_url;
        this.token = token;
        this.bucket = bucket;
        this.kind = kind;
        this.org = org;
        this.mongo_uri = mongo_uri;
        this.mongo_db_name = mongo_db_name;
        this.mongo_user_name = mongo_user_name;
        this.mongo_user_password = mongo_user_password;
    }

    public DataBasesConfig() {
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }
    
    public String getInflux_url() {
        return influx_url;
    }

    public void setInflux_url(String influx_url) {
        this.influx_url = influx_url;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public String getOrg() {
        return org;
    }

    public void setOrg(String org) {
        this.org = org;
    }

    public String getMongo_uri() {
        return mongo_uri;
    }

    public void setMongo_uri(String mongo_uri) {
        this.mongo_uri = mongo_uri;
    }

    public String getMongo_db_name() {
        return mongo_db_name;
    }

    public void setMongo_db_name(String mongo_db_name) {
        this.mongo_db_name = mongo_db_name;
    }

    public String getMongo_user_name() {
        return mongo_user_name;
    }

    public void setMongo_user_name(String mongo_user_name) {
        this.mongo_user_name = mongo_user_name;
    }

    public String getMongo_user_password() {
        return mongo_user_password;
    }

    public void setMongo_user_password(String mongo_user_password) {
        this.mongo_user_password = mongo_user_password;
    }

    @Override
    public String toString() {
        return "DataBasesConfig [token=" + token + ", bucket=" + bucket + ", org=" + org + ", mongo_uri=" + mongo_uri
                + ", mongo_db_name=" + mongo_db_name + ", mongo_user_name=" + mongo_user_name + ", mongo_user_password="
                + mongo_user_password + "]";
    }

}
