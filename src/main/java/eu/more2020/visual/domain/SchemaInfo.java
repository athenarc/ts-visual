package eu.more2020.visual.domain;

import java.util.List;

public class SchemaInfo {

    private String id;
    private String timeCol;
    private String valueCol;
    private String idCol;
    private Boolean isConfiged;
    private String schema;

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public Boolean getIsConfiged() {
        return isConfiged;
    }

    public void setIsConfiged(Boolean isConfiged) {
        this.isConfiged = isConfiged;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimeCol() {
        return timeCol;
    }

    public void setTimeCol(String timeCol) {
        this.timeCol = timeCol;
    }

    public String getValueCol() {
        return valueCol;
    }

    public void setValueCol(String valueCol) {
        this.valueCol = valueCol;
    }

    public String getIdCol() {
        return idCol;
    }

    public void setIdCol(String idCol) {
        this.idCol = idCol;
    }

    @Override
    public String toString() {
        return "SchemaInfo [id=" + id + ", idCol=" + idCol + ", isConfiged=" + isConfiged + ", timeCol=" + timeCol
                + ", valueCol=" + valueCol + ", schema=" + schema + "]";
    }
    
}
