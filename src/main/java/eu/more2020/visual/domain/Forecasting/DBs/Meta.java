package eu.more2020.visual.domain.Forecasting.DBs;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("meta")
public class Meta<T> {

    @Id
    private ObjectId _id;
    private String model_type;
    private String model_name;
    private String model_path;
    private String target;
    private String time_interval;
    private String kind;
    private T features;
    private T scaler;
    private T target_scaler;
    private String[] feature_names;

    // Add getters and setters for all the fields
    
    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public ObjectId get_id() {
        return _id;
    }

    public void set_id(ObjectId _id) {
        this._id = _id;
    }

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

    public String getModel_path() {
        return model_path;
    }

    public void setModel_path(String model_path) {
        this.model_path = model_path;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getTime_interval() {
        return time_interval;
    }

    public void setTime_interval(String time_interval) {
        this.time_interval = time_interval;
    }

    public T getFeatures() {
        return features;
    }

    public void setFeatures(T features) {
        this.features = features;
    }

    public T getScaler() {
        return scaler;
    }

    public void setScaler(T scaler) {
        this.scaler = scaler;
    }

    public T getTarget_scaler() {
        return target_scaler;
    }

    public void setTarget_scaler(T target_scaler) {
        this.target_scaler = target_scaler;
    }

    public String[] getFeature_names() {
        return feature_names;
    }

    public void setFeature_names(String[] feature_names) {
        this.feature_names = feature_names;
    }

    // Nested class to represent the "features" field
    public static class Features {
        private ColumnFeature[] columnFeatures;
        private OptionalFeatures optionalFeatures;

        // Add getters and setters for all the fields

        public ColumnFeature[] getColumnFeatures() {
            return columnFeatures;
        }

        public void setColumnFeatures(ColumnFeature[] columnFeatures) {
            this.columnFeatures = columnFeatures;
        }

        public OptionalFeatures getOptionalFeatures() {
            return optionalFeatures;
        }

        public void setOptionalFeatures(OptionalFeatures optionalFeatures) {
            this.optionalFeatures = optionalFeatures;
        }
    }

    // Nested class to represent the "columnFeatures" field
    public static class ColumnFeature {
        private String columnName;
        private String[] features;

        // Add getters and setters for all the fields

        public String getColumnName() {
            return columnName;
        }

        public void setColumnName(String columnName) {
            this.columnName = columnName;
        }

        public String[] getFeatures() {
            return features;
        }

        public void setFeatures(String[] features) {
            this.features = features;
        }
    }

    // Nested class to represent the "optionalFeatures" field
    public static class OptionalFeatures {
        private String[] temporal;

        // Add getters and setters for all the fields

        public String[] getTemporal() {
            return temporal;
        }

        public void setTemporal(String[] temporal) {
            this.temporal = temporal;
        }
    }

    // Nested class to represent the "scaler" and "target_scaler" fields
    public static class Scaler {
        private double[] min;
        private double[] scale;

        // Add getters and setters for all the fields

        public double[] getMin() {
            return min;
        }

        public void setMin(double[] min) {
            this.min = min;
        }

        public double[] getScale() {
            return scale;
        }

        public void setScale(double[] scale) {
            this.scale = scale;
        }
    }
}
