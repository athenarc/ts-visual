package eu.more2020.visual.domain;

public class DbColumns {
    String timeCol;
    String idCol;
    String valueCol;
    Boolean isConfiged;
    
    public DbColumns() {
    }
    public DbColumns(String timeCol, String idCol, String valueCol, Boolean isConfiged) {
        this.timeCol = timeCol;
        this.idCol = idCol;
        this.valueCol = valueCol;
        this.isConfiged = isConfiged;
    }
    public DbColumns(String timeCol) {
        this.timeCol = timeCol;
    }
    public String getTimeCol() {
        return timeCol;
    }
    public void setTimeCol(String timeCol) {
        this.timeCol = timeCol;
    }
    public String getIdCol() {
        return idCol;
    }
    public void setIdCol(String idCol) {
        this.idCol = idCol;
    }
    public String getValueCol() {
        return valueCol;
    }
    public void setValueCol(String valueCol) {
        this.valueCol = valueCol;
    }
    public Boolean getIsConfiged() {
        return isConfiged;
    }
    public void setIsConfiged(Boolean isConfiged) {
        this.isConfiged = isConfiged;
    }

}
