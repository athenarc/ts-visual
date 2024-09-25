package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class TimestampReq implements Serializable {
    private Long timestamp;
    private String model_name;
    private String kind;

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public TimestampReq(Long timestamp, String model_name, String kind) {
        this.timestamp = timestamp;
        this.model_name = model_name;
        this.kind = kind;
    }

    public TimestampReq() {
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

}
