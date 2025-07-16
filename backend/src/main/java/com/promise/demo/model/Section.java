package com.promise.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class Section {

    @Id
    @Column(name = "section_id" , unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sectionId;

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    @JsonIgnore
    private Questionnaire questionnaire;

    @JsonProperty("text")
    @Column(name = "section_text")
    private String sectionText;
    private int sectionOrder;

    public Section() {
    }

    public Integer getSectionId() {
        return sectionId;
    }

    public void setSectionId(int sectionId) {
        this.sectionId = sectionId;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public String getSectionText() {
        return sectionText;
    }

    public void setSectionText(String text) {
        this.sectionText = text;
    }

    public int getSectionOrder() {
        return sectionOrder;
    }

    public void setSectionOrder(int sectionOrder) {
        this.sectionOrder = sectionOrder;
    }

}
