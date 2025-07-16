package com.promise.demo.repository;

import com.promise.demo.model.ResponseTypeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResponseTypeOptionRepository extends JpaRepository<ResponseTypeOption, Integer> {

    @Query("SELECT r FROM ResponseTypeOption r WHERE r.responseType.responseTypeId IN :ids ORDER BY r.responseType.responseTypeId, r.option_value")
    List<ResponseTypeOption> findByResponseTypeIds(@Param("ids") List<Integer> ids);

}
