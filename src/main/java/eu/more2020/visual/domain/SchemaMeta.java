package eu.more2020.visual.domain;

import java.io.Serializable;
import java.util.List;

public class SchemaMeta implements Serializable {

    private String name;
    private String type;
    private List<SchemaInfo> data;
    private Boolean isTimeSeries;

    public SchemaMeta () {

    }

    public SchemaMeta(String name, String type, List<SchemaInfo> data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SchemaInfo> getData() {
        return this.data;
    }

    public void setData(List<SchemaInfo> data) {
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getIsTimeSeries() {
        return isTimeSeries;
    }

    public void setIsTimeSeries(Boolean isTimeSeries) {
        this.isTimeSeries = isTimeSeries;
    }


    @Override
    public String toString() {
        return "SchemaMeta{" +
            "name='" + name + '\'' +
            ", type='" + type + '\'' +
            ", data=" + data +
            '}';
    }
}
