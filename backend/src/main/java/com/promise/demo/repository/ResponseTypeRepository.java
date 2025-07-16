package com.promise.demo.repository;

import com.promise.demo.model.ResponseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResponseTypeRepository extends JpaRepository<ResponseType, Integer> {
    List<ResponseType> findByResponseTypeNameContainingIgnoreCase(String query);
    Optional<ResponseType> findByResponseTypeNameIgnoreCase(String responseTypeName);

}
