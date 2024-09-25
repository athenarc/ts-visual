package eu.more2020.visual.repository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import eu.more2020.visual.config.ApplicationProperties;
import eu.more2020.visual.domain.SchemaInfo;
import eu.more2020.visual.domain.SchemaMeta;

@Repository
public class FileHandlingRepoImpl implements FileHandlingRepository {
  private final ApplicationProperties applicationProperties;
  private final Logger log = LoggerFactory.getLogger(FileHandlingRepoImpl.class);

  public FileHandlingRepoImpl(ApplicationProperties applicationProperties) {
    this.applicationProperties = applicationProperties;
  }

  public void saveFile(String schemaName, MultipartFile file, String fileName) {
    Path rootLocation = Paths.get(applicationProperties.getWorkspacePath());
    String newName;
    if (!file.getOriginalFilename().equals(fileName) && !fileName.equals(null)) {
      newName = fileName;
    } else {
      newName = file.getOriginalFilename();
    }
    try {
      if (file.isEmpty()) {
        throw new RuntimeException("Failed to store file " + file.getOriginalFilename() + "Error: File is Empty");
      }
      Files.copy(file.getInputStream(), rootLocation.resolve(schemaName + "/" + file.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
    } catch (Exception e) {
      throw new RuntimeException("Failed to store file " + file.getOriginalFilename() + "Error:" + e.getMessage());
    }
  }

  public void saveSchema(SchemaMeta metaInfo, MultipartFile[] files) throws IOException {
    Path rootLocation = Paths.get(applicationProperties.getWorkspacePath());
    File dir = new File(rootLocation + "/" + metaInfo.getName());
    if (!dir.exists()) {
      dir.mkdir();
      File metaFile = new File(rootLocation + "/" + metaInfo.getName() + "/" + metaInfo.getName() + ".meta.json");
      ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
      mapper.writeValue(metaFile, metaInfo);
    }
    try {
      Arrays
        .asList(files)
        .stream()
        .forEach(
          file -> {
            this.saveFile(metaInfo.getName(), file, metaInfo.getData().get(Arrays.asList(files).indexOf(file)).getId());
          }
        );
    } catch (Exception e) {
      log.debug("Fail to upload files!");
    }
  }

  public void uploadDataset(SchemaInfo metaInfo, MultipartFile file, String schemaName) throws IOException {
    Path rootLocation = Paths.get(applicationProperties.getWorkspacePath());
    File metaFile = new File(rootLocation + "/" + schemaName + "/" + schemaName + ".meta.json");
    ObjectMapper obm = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    SchemaMeta thisSchema = obm.readValue(metaFile, SchemaMeta.class);
    List<SchemaInfo> schemaData = thisSchema.getData();
    schemaData.add(metaInfo);
    thisSchema.setData(schemaData);
    obm.writeValue(metaFile, thisSchema);
    try {
    this.saveFile(schemaName, file, metaInfo.getId());
    } catch (Exception e) {
      log.debug("Fail to upload files!");
    }
  }
}
