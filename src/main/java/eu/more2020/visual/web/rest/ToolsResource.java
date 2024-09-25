package eu.more2020.visual.web.rest;

import eu.more2020.visual.domain.Alert;
import eu.more2020.visual.domain.Connection;
import gr.imsi.athenarc.visual.middleware.domain.MultiVariateDataPoint;
import eu.more2020.visual.repository.AlertRepository;
import eu.more2020.visual.repository.ConnectionRepository;
import eu.more2020.visual.service.ToolsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ToolsResource {
    private final Logger log = LoggerFactory.getLogger(DatasetResource.class);
    private final ToolsService toolsService;
    private final AlertRepository alertRepository;
    private final ConnectionRepository connectionRepository;

    public ToolsResource(ToolsService toolsService,
                         AlertRepository alertRepository,
                         ConnectionRepository connectionRepository) {
        this.toolsService = toolsService; 
        this.connectionRepository = connectionRepository;
        this.alertRepository = alertRepository;
    }

    @PostMapping("/tools/forecasting/{id}")
    public List<MultiVariateDataPoint> forecast(@PathVariable String id) throws IOException {
        log.debug("REST request to get Forecast");
        return toolsService.forecasting(id);
    }
    

    @GetMapping("/alerts/{datasetId}")
    public List<Alert> getAlerts(@PathVariable String datasetId) throws IOException {
        log.debug("REST request to find alerts for {} dataset", datasetId);
        return alertRepository.getAlerts(datasetId);
    }

    @PostMapping("/alerts/add")
    public List<Alert> saveAlert(@Valid @RequestBody Alert alertInfo) throws IOException {
        log.debug("REST request to add alert with name: {}", alertInfo.getName());
        return alertRepository.saveAlert(alertInfo);
    }

    @PostMapping("/alerts/remove/{datasetId}/{alertName}")
    public List<Alert> deleteAlert(@PathVariable String datasetId, @PathVariable String alertName) throws IOException {
        log.debug("REST request to remove alert with name: {}", alertName);
        return alertRepository.deleteAlert(alertName, datasetId);
    }

    @PostMapping("/alerts/edit")
    public List<Alert> editAlert(@Valid @RequestBody Alert editedAlert) throws IOException {
        log.debug("REST request to edit alert with name: {}", editedAlert.getName());
        return alertRepository.editAlert(editedAlert);
    }

    @PostMapping("/connector/add")
    public List<Connection> saveConnection(@Valid @RequestBody Connection connectionInfo) throws Exception {
        log.debug("REST request to add connection with name: {}", connectionInfo.getName());
        return connectionRepository.saveConnection(connectionInfo);
    }

    @GetMapping("/connector/get/{connectionName}")
    public List<Connection> getConnection(@PathVariable String connectionName) throws Exception {
        log.debug("REST request to get connection with name: {}", connectionName);
        return connectionRepository.getConnection(connectionName);
    }

    @GetMapping("/connector/get")
    public List<Connection> getAllConnections() throws Exception {
        log.debug("REST request to get connections");
        return connectionRepository.getAllConnections();
    }

    @PostMapping("/connector/remove/{connectionName}")
    public List<Connection> deleteConnection(@PathVariable String connectionName) throws Exception {
        log.debug("REST request to remove connection with name: {}", connectionName);
        return connectionRepository.deleteConnection(connectionName);
    }
}

