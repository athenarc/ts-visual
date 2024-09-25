package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;
import java.util.Map;

public class ProgressRes implements Serializable {
    private String id;
    private Map<String, String> data;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    public ProgressRes() {
    }

    public ProgressRes(String id, Map<String, String> data) {
        this.id = id;
        this.data = data;
    }

}
