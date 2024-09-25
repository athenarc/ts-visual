package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;
import java.util.Map;

public class ResultsRes implements Serializable {
    private String target;
    private Map<String, PredictionsRes> metrics;

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public Map<String, PredictionsRes> getMetrics() {
        return metrics;
    }

    public void setMetrics(Map<String, PredictionsRes> metrics) {
        this.metrics = metrics;
    }

    public ResultsRes(String target, Map<String, PredictionsRes> metrics) {
        this.target = target;
        this.metrics = metrics;
    }

    public ResultsRes() {
    }

}
