package com.promise.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="questionnaire")
public class Questionnaire {
    @Id
    @Column(name = "questionnaire_id" , unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionnaireId;
    @Column(unique = true, nullable = false)
    private String title;
    private String description;
    private double version;
    private String type;
    private String formula;

    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;
    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Section> sections;

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    public Questionnaire() {}

    public Questionnaire(int questionnaireId, String title, String description, double version, String type) {
        this.questionnaireId = questionnaireId;
        this.title = title;
        this.description = description;
        this.version = version;
        this.type = type;

        System.out.println(questionnaireId + " " + title + " " + description + " " + version + " " + type);
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }

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

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
