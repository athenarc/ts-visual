package eu.more2020.visual.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.protobuf.InvalidProtocolBufferException;
import eu.more2020.visual.domain.*;
import gr.imsi.athenarc.visual.middleware.domain.ImmutableDataPoint;
import gr.imsi.athenarc.visual.middleware.domain.MultiVariateDataPoint;

import java.io.IOException;
import java.util.List;

/**
 * Repository for the Dataset entity.
 */
@SuppressWarnings("unused")
public interface ToolsService {
    List<MultiVariateDataPoint> forecasting(String id);

}
