package eu.more2020.visual.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import eu.more2020.visual.domain.Forecasting.DBs.Meta;

public interface MetaRepository extends MongoRepository<Meta, String> {
    // You can add custom query methods here if needed
    @Query(value = "{ 'model_name' : ?0 }", delete = true)
    long deleteByModelName(String modelName);

    @Query(value = "{ 'model_name' : { $ne: ?0 } }")
    List<Meta> findAllByModelNameNot(String modelName);
}