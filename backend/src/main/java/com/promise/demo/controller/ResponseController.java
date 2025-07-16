package com.promise.demo.controller;

import com.promise.demo.dto.ResponseDTO;
import com.promise.demo.model.Question;
import com.promise.demo.model.Questionnaire;
import com.promise.demo.model.Response;
import com.promise.demo.repository.QuestionRepository;
import com.promise.demo.repository.QuestionnaireRepository;
import com.promise.demo.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/submit")
    public ResponseEntity<String> submitResponses(@RequestBody List<ResponseDTO> responseDTOs) {
        if (responseDTOs.isEmpty()) {
            return ResponseEntity.badRequest().body("No responses submitted.");
        }

        String sessionId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        List<Response> responses = responseDTOs.stream().map(dto -> {
            Questionnaire qn = questionnaireRepository.findById(dto.getQuestionnaireId()).orElseThrow();
            Question q = questionRepository.findById(dto.getQuestionId()).orElseThrow();

            Response response = new Response(qn, q, dto.getPatientId(), dto.getAnswer());
            response.setSessionId(sessionId);
            response.setDateCompleted(now);
            return response;
        }).collect(Collectors.toList());

        responseRepository.saveAll(responses);
        return ResponseEntity.ok("Responses submitted successfully.");
    }
}
