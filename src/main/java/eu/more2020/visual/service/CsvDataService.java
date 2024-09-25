package eu.more2020.visual.service;

import gr.imsi.athenarc.visual.middleware.domain.Query.Query;
import gr.imsi.athenarc.visual.middleware.domain.QueryResults;
import gr.imsi.athenarc.visual.middleware.domain.TimeRange;
import gr.imsi.athenarc.visual.middleware.domain.Dataset.CsvDataset;
import gr.imsi.athenarc.visual.middleware.index.csv.CsvTTI;
import org.apache.logging.log4j.LogManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.DoubleSummaryStatistics;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvDataService {
    private static final org.apache.logging.log4j.Logger LOG = LogManager.getLogger(CsvDataService.class);

    private final Logger log = LoggerFactory.getLogger(CsvDataService.class);
    private HashMap<String, CsvTTI> indexes = new HashMap<>();


    public void removeIndex(String id, String schemaName) {
        indexes.remove(id, schemaName);
    }

    private synchronized List<CsvTTI> getIndexes(CsvDataset dataset, Query query) throws IOException {
        List<CsvTTI> ttis = dataset.getFileInfoList().stream().filter(dataFileInfo ->
                dataFileInfo.getTimeRange().intersects(query))
            .map(dataFileInfo -> {
                CsvTTI tti = indexes.get(dataFileInfo.getFilePath());
                if (tti == null) {
                    tti = new CsvTTI(dataFileInfo.getFilePath(), dataset);
                    this.indexes.put(dataFileInfo.getFilePath(), tti);
                }
                return tti;
            }).collect(Collectors.toList());
        return ttis;
    }

    public QueryResults executeQuery(CsvDataset dataset, Query query) {
//        log.debug(query.toString());
        QueryResults queryResults = new QueryResults();
        queryResults.setData(new HashMap<>());
        queryResults.setTimeRange(new TimeRange(query.getFrom(), query.getTo()));
        queryResults.setMeasureStats(new HashMap<>());

        try {
            List<CsvTTI> ttis = this.getIndexes(dataset, query);
            for (CsvTTI tti : ttis) {
                QueryResults partialResults = tti.executeQuery(query);
//                LOG.debug("{}", partialResults);
//                queryResults.getData().addAll(partialResults.getData());
                partialResults.getData().forEach((key, list2) -> queryResults.getData().merge(key, list2, (list1, listToAdd) -> {
                    list1.addAll(listToAdd);
                    return list1;
                }));
                partialResults.getMeasureStats().forEach((measure, statistics) -> {
                    DoubleSummaryStatistics currentStatistics = queryResults.getMeasureStats().get(measure);
                    if (currentStatistics == null) {
                        queryResults.getMeasureStats().put(measure, statistics);
                    } else {
                        currentStatistics.combine(statistics);
                    }
                });
            }
            // queryResults.getMeasureStats().forEach((integer, doubleSummaryStatistics) -> log.debug(doubleSummaryStatistics.toString()));
            return queryResults;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
