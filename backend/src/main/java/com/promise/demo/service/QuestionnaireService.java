package com.promise.demo.service;

import com.promise.demo.dto.QuestionDTO;
import com.promise.demo.dto.SectionDTO;
import com.promise.demo.dto.UpdateQuestionnaireDTO;
import com.promise.demo.model.*;
import com.promise.demo.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;
    private final SectionRepository sectionRepository;
    private final ResponseTypeRepository responseTypeRepository;

    public QuestionnaireService(
            QuestionnaireRepository questionnaireRepository,
            QuestionRepository questionRepository,
            SectionRepository sectionRepository,
            ResponseTypeRepository responseTypeRepository
    ) {
        this.questionnaireRepository = questionnaireRepository;
        this.questionRepository = questionRepository;
        this.sectionRepository = sectionRepository;
        this.responseTypeRepository = responseTypeRepository;
    }

    @Transactional
    public void updateQuestionnaire(UpdateQuestionnaireDTO dto) {
        // 1. Fetch the existing questionnaire by ID
        Questionnaire questionnaire = questionnaireRepository.findById(dto.getQuestionnaireId())
                .orElseThrow(() -> new RuntimeException("Questionnaire not found"));

        // 2. Update basic questionnaire fields
        questionnaire.setTitle(dto.getTitle());
        questionnaire.setDescription(dto.getDescription());
        questionnaire.setVersion(dto.getVersion());
        questionnaire.setType(dto.getType());
        questionnaire.setFormula(dto.getFormula());

        // -------------------- HANDLE QUESTIONS --------------------
        Map<Integer, Question> existingQuestionsMap = questionnaire.getQuestions().stream()
                .filter(q -> q.getQuestionId() != null)
                .collect(Collectors.toMap(Question::getQuestionId, q -> q));

        List<Question> updatedQuestions = new ArrayList<>();

        for (UpdateQuestionnaireDTO.QuestionUpdateDTO qdto : dto.getQuestions()) {
            Question question;
            if (qdto.getId() > 0 && existingQuestionsMap.containsKey(qdto.getId())) {
                // Update existing question
                question = existingQuestionsMap.get(qdto.getId());
            } else {
                // New question
                question = new Question();
                question.setQuestionnaire(questionnaire);
            }

            question.setText(qdto.getText());
            question.setQuestionOrder(qdto.getQuestionOrder());

            if (qdto.getResponseTypeId() != null) {
                responseTypeRepository.findById(qdto.getResponseTypeId())
                        .ifPresent(question::setResponseType);
            } else {
                question.setResponseType(null);
            }

            updatedQuestions.add(question);
        }

        // Preserve reference to avoid orphanRemoval issue
        questionnaire.getQuestions().clear();
        questionnaire.getQuestions().addAll(updatedQuestions);

        // -------------------- HANDLE SECTIONS --------------------
        Map<Integer, Section> existingSectionsMap = questionnaire.getSections().stream()
                .filter(s -> s.getSectionId() != null)
                .collect(Collectors.toMap(Section::getSectionId, s -> s));

        List<Section> updatedSections = new ArrayList<>();

        for (UpdateQuestionnaireDTO.SectionUpdateDTO sdto : dto.getSections()) {
            Section section;
            if (sdto.getId() > 0 && existingSectionsMap.containsKey(sdto.getId())) {
                // Update existing section
                section = existingSectionsMap.get(sdto.getId());
            } else {
                // New section
                section = new Section();
                section.setQuestionnaire(questionnaire);
            }

            section.setSectionText(sdto.getText());
            section.setSectionOrder(sdto.getSectionOrder());

            updatedSections.add(section);
        }

        questionnaire.getSections().clear();
        questionnaire.getSections().addAll(updatedSections);

        // 3. Save the updated entity (cascades to questions and sections)
        questionnaireRepository.save(questionnaire);
    }

}
