package eu.more2020.visual.repository;

import java.io.IOException;
import java.util.List;

import eu.more2020.visual.domain.Alert;

/**
 * Repository for the Alert entity.
 */
@SuppressWarnings("unused")
public interface AlertRepository {

    String DATASETS_CACHE = "datasets";

    List<Alert> saveAlert(Alert alert) throws IOException;

    List<Alert> deleteAlert(String alertName, String datasetId) throws IOException;
    
    List<Alert> getAlerts(String datasetId) throws IOException;
    
    List<Alert> editAlert(Alert editedAlert) throws IOException;


}
