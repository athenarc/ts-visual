package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;
import java.util.Map;

public class HandleDataRes implements Serializable {

    private Map<String, Float> results;

    public Map<String, Float> getResults() {
        return results;
    }

    public void setResults(Map<String, Float> results) {
        this.results = results;
    }

}
