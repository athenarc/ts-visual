package eu.more2020.visual.web.rest;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eu.more2020.visual.domain.UserSession;
import eu.more2020.visual.domain.Forecasting.DBs.Meta;
import eu.more2020.visual.domain.Forecasting.Grpc.AllResultsRes;
import eu.more2020.visual.domain.Forecasting.Grpc.HandleDataReq;
import eu.more2020.visual.domain.Forecasting.Grpc.HandleDataRes;
import eu.more2020.visual.domain.Forecasting.Grpc.InferenceRes;
import eu.more2020.visual.domain.Forecasting.Grpc.JobIdReq;
import eu.more2020.visual.domain.Forecasting.Grpc.ModelInfoReq;
import eu.more2020.visual.domain.Forecasting.Grpc.ProgressRes;
import eu.more2020.visual.domain.Forecasting.Grpc.ResultsRes;
import eu.more2020.visual.domain.Forecasting.Grpc.StatusRes;
import eu.more2020.visual.domain.Forecasting.Grpc.TargetReq;
import eu.more2020.visual.domain.Forecasting.Grpc.TimestampReq;
import eu.more2020.visual.domain.Forecasting.Grpc.TrainingInfoReq;
import eu.more2020.visual.repository.MetaRepository;
import eu.more2020.visual.service.SessionService;
import eu.more2020.visual.service.forecasting.ForecastingAthenaImpl;
import eu.more2020.visual.service.forecasting.ForecastingCallsImpl;
import eu.more2020.visual.service.forecasting.ForecastingUtils;

@RestController
@RequestMapping("/api")
public class ForecastingResource {
    private final Logger log = LoggerFactory.getLogger(ForecastingResource.class);
    private final ForecastingCallsImpl forecastingCallsImpl;
    private final ForecastingAthenaImpl forecastingAthenaImpl;
    private final ForecastingUtils forecastingUtils; 
    @Autowired
    private MetaRepository metaRepository;

    @Autowired
    private final SessionService sessionService;

    public ForecastingResource(ForecastingCallsImpl forecastingCallsImpl, 
                               ForecastingUtils forecastingUtils, 
                               ForecastingAthenaImpl forecastingAthenaImpl,
                               SessionService sessionService) {
        this.forecastingCallsImpl = forecastingCallsImpl;
        this.forecastingUtils = forecastingUtils;
        this.forecastingAthenaImpl = forecastingAthenaImpl;
        this.sessionService = sessionService;
    }

    @PostMapping("/forecasting/train")
    public ResponseEntity<StatusRes> StartTraining(@RequestParam String sessionId, @RequestBody TrainingInfoReq info) throws IOException {
        log.debug("REST request to start training");
        UserSession userSession = sessionService.getSession(sessionId);
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingStartTraining(userSession, info));
    }

    @PostMapping("/forecasting/progress")
    public ResponseEntity<ProgressRes> GetProgress(@RequestBody JobIdReq jobid) throws IOException {
        log.debug("REST request to get progress of job with id: ", jobid.getId());
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingGetProgress(jobid));
    }
    
    @PostMapping("/forecasting/target")
    public ResponseEntity<ResultsRes> GetTargetResult(@RequestBody TargetReq target) throws IOException {
        log.debug("REST request to get results of job with id: ", target.getId());
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingSpecificResults(target));
    }
    
    @PostMapping("/forecasting/target/all")
    public ResponseEntity<AllResultsRes> GetAllTargetsResults(@RequestBody JobIdReq jobId) throws IOException {
        log.debug("REST request to get all results for job with id: ", jobId.getId());
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingAllResults(jobId));
    }
    
    @PostMapping("/forecasting/inference")
    public ResponseEntity<InferenceRes> GetInference(@RequestParam String sessionId, @RequestBody TimestampReq timestamp) throws IOException {
        log.debug("REST request to get inference of model: ", timestamp.getModel_name());
        UserSession userSession = sessionService.getSession(sessionId);
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingInference(userSession, timestamp));
    }
    
    @PostMapping("/forecasting/Athenainference")
    public ResponseEntity<HandleDataRes> GetAthenaInference(@RequestBody HandleDataReq req) throws IOException {
        log.debug("REST request to get Athena inference of dataset: {}", req.getData_id());
        return ResponseEntity.ok().body(forecastingAthenaImpl.ForecastingAthenaInference(req));
    }
    
    @PostMapping("/forecasting/save")
    public ResponseEntity<List<Meta>> SaveModel(@RequestBody ModelInfoReq modelInfo) throws IOException {
        log.debug("REST request to get all results for job with model name: ", modelInfo.getModel_name());
        return ResponseEntity.ok().body(forecastingCallsImpl.ForecastingSaveModel(modelInfo));
    }
    
    @GetMapping("/forecasting/models")
    public ResponseEntity<List<Meta>> GetSavedModels() {
        log.debug("REST request to get all mongo meta files: ");
        return ResponseEntity.ok().body(metaRepository.findAll());
    }

    @DeleteMapping("/forecasting/models/{modelName}")
    public ResponseEntity<List<Meta>> deleteModelByName(@PathVariable String modelName) {
        log.debug("REST request to delete mongo meta file : " + modelName);
        return forecastingUtils.deleteForecastingModel(modelName);
    }

    @GetMapping("/forecasting/initialize")
    public ResponseEntity <String> InitializeForecasting () {
        log.debug("REST request to initialize DBs");
        return ResponseEntity.ok().body(forecastingUtils.dbsInitialization());
    }
}
