package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class AllResultsRes implements Serializable {
    private ResultsRes[] results;

    public ResultsRes[] getResults() {
        return results;
    }

    public void setResults(ResultsRes[] results) {
        this.results = results;
    }

    public AllResultsRes(ResultsRes[] results) {
        this.results = results;
    }

    public AllResultsRes() {
    }

}
