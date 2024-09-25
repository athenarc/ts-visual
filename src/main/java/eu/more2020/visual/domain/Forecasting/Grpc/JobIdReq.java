package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class JobIdReq implements Serializable {
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public JobIdReq() {
    }

    public JobIdReq(String id) {
        this.id = id;
    }

}
