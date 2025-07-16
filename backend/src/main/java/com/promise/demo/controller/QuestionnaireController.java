package com.promise.demo.controller;

import com.promise.demo.dto.QuestionDTO;
import com.promise.demo.dto.QuestionnaireDTO;
import com.promise.demo.dto.SectionDTO;
import com.promise.demo.dto.UpdateQuestionnaireDTO;
import com.promise.demo.model.Question;
import com.promise.demo.model.Questionnaire;
import com.promise.demo.model.ResponseType;
import com.promise.demo.model.Section;
import com.promise.demo.repository.QuestionnaireRepository;
import com.promise.demo.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @PostMapping
    public String saveQuestionnaire(@RequestBody QuestionnaireDTO dto) {
        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setTitle(dto.getTitle());
        questionnaire.setDescription(dto.getDescription());
        questionnaire.setVersion(dto.getVersion());
        questionnaire.setType(dto.getType());
        questionnaire.setFormula(dto.getFormula());

        List<Question> questions = dto.getQuestions().stream().map(qDto -> {
            Question q = new Question();
            q.setText(qDto.getText());
            q.setQuestionOrder(qDto.getQuestionOrder());
            q.setQuestionnaire(questionnaire);
            if (qDto.getResponseTypeId() != null) {
                q.setResponseType(new ResponseType(qDto.getResponseTypeId()));
            }
            return q;
        }).toList();

        List<Section> sections = dto.getSections().stream().map(sDto -> {
            Section s = new Section();
            s.setSectionText(sDto.getText());
            s.setSectionOrder(sDto.getSectionOrder());
            s.setQuestionnaire(questionnaire);
            // ResponseType logic for sections if needed
            return s;
        }).toList();

        questionnaire.setQuestions(questions);
        questionnaire.setSections(sections);

        questionnaireRepository.save(questionnaire);
        return "Questionnaire saved to database!";
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/byTitle")
    public ResponseEntity<Questionnaire> getByTitle(@RequestParam String title) {
        return questionnaireRepository.findByTitle(title)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public QuestionnaireController(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateQuestionnaire(@RequestBody UpdateQuestionnaireDTO dto) {
        try {
            questionnaireService.updateQuestionnaire(dto);
            return ResponseEntity.ok("Questionnaire updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Update failed: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/existsByTitle")
    public ResponseEntity<Boolean> checkIfTitleExists(@RequestParam String title) {
        boolean exists = questionnaireRepository.findByTitle(title).isPresent();
        return ResponseEntity.ok(exists);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/title-exists-for-other")
    public ResponseEntity<Boolean> titleExistsForAnotherQuestionnaire(
            @RequestParam String title,
            @RequestParam int idToExclude) {

        Optional<Questionnaire> existing = questionnaireRepository.findByTitle(title);

        boolean existsForOther = existing.isPresent() && existing.get().getQuestionnaireId() != idToExclude;

        return ResponseEntity.ok(existsForOther);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/search")
    public List<Map<String, Object>> searchQuestionnaires(@RequestParam String query) {
        List<Questionnaire> results = questionnaireRepository.findByTitleContainingIgnoreCase(query);
        return results.stream()
                .map(q -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", q.getQuestionnaireId());
                    map.put("title", q.getTitle());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }


}