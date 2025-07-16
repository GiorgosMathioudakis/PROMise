package com.promise.demo.repository;
import java.util.Optional;
import com.promise.demo.model.Question;
import com.promise.demo.model.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {

}
