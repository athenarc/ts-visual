package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class ModelInfoReq implements Serializable {
    private String model_type;
    private String model_name;
    private String target;

    public String getModel_type() {
        return model_type;
    }

    public void setModel_type(String model_type) {
        this.model_type = model_type;
    }

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public ModelInfoReq(String model_type, String model_name, String target) {
        this.model_type = model_type;
        this.model_name = model_name;
        this.target = target;
    }

    public ModelInfoReq() {
    }

}
