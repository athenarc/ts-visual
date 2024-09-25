package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class StatusRes implements Serializable {

    private String id;
    private String status;

    // Getters - Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public StatusRes() {
    }

    public StatusRes(String id, String status) {
        this.id = id;
        this.status = status;
    }

}
