package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class TrainingInfoReq implements Serializable {
    private String id;
    private String config;


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getConfig() {
        return config;
    }
    public void setConfig(String config) {
        this.config = config;
    }
    public TrainingInfoReq(String id, String config) {
        this.id = id;
        this.config = config;
    }
    public TrainingInfoReq() {
    }
}
