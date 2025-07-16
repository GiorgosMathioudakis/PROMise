package com.promise.demo.dto;

import java.util.List;

public class UpdateQuestionnaireDTO {
    private int questionnaireId;
    private String title;
    private String description;
    private double version;
    private String type;
    private String formula;

    private List<QuestionUpdateDTO> questions;
    private List<SectionUpdateDTO> sections;

    public static class QuestionUpdateDTO extends QuestionDTO {
        private int id; // corresponds to questionId

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }
    }

    public static class SectionUpdateDTO extends SectionDTO {
        private int id; // corresponds to sectionId

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }
    }

    // Getters and setters for all main fields

    public int getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(int questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getVersion() {
        return version;
    }

    public void setVersion(double version) {
        this.version = version;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }

    public List<QuestionUpdateDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionUpdateDTO> questions) {
        this.questions = questions;
    }

    public List<SectionUpdateDTO> getSections() {
        return sections;
    }

    public void setSections(List<SectionUpdateDTO> sections) {
        this.sections = sections;
    }
}
