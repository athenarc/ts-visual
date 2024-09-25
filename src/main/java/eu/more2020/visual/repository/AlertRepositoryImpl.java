package eu.more2020.visual.repository;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import eu.more2020.visual.config.ApplicationProperties;
import eu.more2020.visual.domain.Alert;

@Repository
public class AlertRepositoryImpl implements AlertRepository {

    private final ApplicationProperties applicationProperties;

    public AlertRepositoryImpl(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public List<Alert> saveAlert(Alert alert) throws IOException{
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        List<Alert> json = new ArrayList();
        File alertFile = new File(applicationProperties.getWorkspacePath(), "alerts.json");
        if(!alertFile.exists() && !alertFile.isDirectory()){
            FileWriter fw = new FileWriter(alertFile);
            json.add(alert);
            mapper.writeValue(fw, json);
            fw.close();
        }else{
            FileReader fr = new FileReader(alertFile);
            json = mapper.readValue(fr, new TypeReference<List<Alert>>() {});
            json.add(alert);
            FileWriter fw = new FileWriter(alertFile);
            mapper.writeValue(fw, json);
            fr.close();
        }
        return json.stream().filter(al -> al.getDatasetId().equals(alert.getDatasetId())).collect(Collectors.toList());
    }
    
    @Override
    public List<Alert> deleteAlert(String alertName, String datasetId) throws IOException{
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        File alertFile = new File(applicationProperties.getWorkspacePath(), "alerts.json");
            FileReader fr = new FileReader(alertFile);
            List<Alert> alerts = mapper.readValue(fr, new TypeReference<List<Alert>>() {});
            alerts.removeIf(al -> al.getName().equals(alertName));
            alerts.forEach(alz -> System.out.println(alz.getName()));
            FileWriter fw = new FileWriter(alertFile);
            mapper.writeValue(fw, alerts);
            fr.close();
            fw.close();
            alerts.removeIf(al -> !al.getDatasetId().equals(datasetId));
        return alerts;
    }
    
    @Override
    public List<Alert> editAlert(Alert editedAlert) throws IOException{
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        Integer counter = 0;
        Integer index = 0;
        mapper.findAndRegisterModules();
        File alertFile = new File(applicationProperties.getWorkspacePath(), "alerts.json");
            FileReader fr = new FileReader(alertFile);
            List<Alert> alerts = mapper.readValue(fr, new TypeReference<List<Alert>>() {});
            for(Alert alert: alerts){
                if(alert.getName().equals(editedAlert.getName())){
                    index = counter;
                }
                counter++;
            }
            alerts.set(index, editedAlert);
            FileWriter fw = new FileWriter(alertFile);
            mapper.writeValue(fw, alerts);
            fr.close();
            fw.close();
            alerts.removeIf(al -> !al.getDatasetId().equals(editedAlert.getDatasetId()));
        return alerts;
    }
   
    @Override
    public List<Alert> getAlerts(String datasetId) throws IOException{
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.findAndRegisterModules();
        File alertFile = new File(applicationProperties.getWorkspacePath(), "alerts.json");
            FileReader fr = new FileReader(alertFile);
            List<Alert> alerts = mapper.readValue(fr, new TypeReference<List<Alert>>() {});
            alerts.removeIf(al -> !al.getDatasetId().equals(datasetId));
            fr.close();
        return alerts;
    }


}
