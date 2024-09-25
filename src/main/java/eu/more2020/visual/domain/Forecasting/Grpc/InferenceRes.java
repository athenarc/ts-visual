package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;
import java.util.Map;

public class InferenceRes implements Serializable {
    private Map<String, Float> predictions;

    public Map<String, Float> getPredictions() {
        return predictions;
    }

    public void setPredictions(Map<String, Float> predictions) {
        this.predictions = predictions;
    }

    public InferenceRes(Map<String, Float> predictions) {
        this.predictions = predictions;
    }

    public InferenceRes() {
    }

}
