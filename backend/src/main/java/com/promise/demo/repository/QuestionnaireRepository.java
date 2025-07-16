package com.promise.demo.repository;

import com.promise.demo.model.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Integer> {

    void deleteByQuestionnaireId(Questionnaire questionnaireId);

    Optional<Questionnaire> findByTitle(String title);

    List<Questionnaire> findByTitleContainingIgnoreCase(String query);
}

