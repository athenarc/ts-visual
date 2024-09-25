package eu.more2020.visual.repository;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import eu.more2020.visual.domain.SchemaInfo;
import eu.more2020.visual.domain.SchemaMeta;

@SuppressWarnings("unused")
public interface FileHandlingRepository {

    void saveFile(String schemaName, MultipartFile file, String fileName);
   
    void uploadDataset(SchemaInfo metaInfo, MultipartFile file, String schemaName) throws IOException;

    void saveSchema(SchemaMeta metaInfo, MultipartFile[] files) throws IOException;

}
