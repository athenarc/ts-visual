package eu.more2020.visual.domain.Forecasting.Grpc;

import java.io.Serializable;

public class HandleDataReq implements Serializable{

    private String data_id;
    private String start_date;
    private String end_date;
    private String use_case_id;
    
    public String getData_id() {
        return data_id;
    }
    public void setData_id(String data_id) {
        this.data_id = data_id;
    }
    public String getStart_date() {
        return start_date;
    }
    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }
    public String getEnd_date() {
        return end_date;
    }
    public void setEnd_date(String end_date) {
        this.end_date = end_date;
    }
    public String getUse_case_id() {
        return use_case_id;
    }
    public void setUse_case_id(String use_case_id) {
        this.use_case_id = use_case_id;
    }

}
