package com.promise.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Question {

    @Id
    @Column(name = "question_id" , unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionId;

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    @JsonIgnore
    private Questionnaire questionnaire;

    private String text;
    private int questionOrder;

    @ManyToOne
    @JoinColumn(name = "response_type_id")
    private ResponseType responseType;

    @Transient
    private Integer responseTypeId;

    public Integer getResponseTypeId() {
        return responseType != null ? responseType.getResponseTypeId() : null;
    }

    public void setResponseTypeId(Integer responseTypeId) {
        this.responseType = new ResponseType(responseTypeId);
    }

    public Question() {
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }

    public ResponseType getResponseType() {
        return responseType;
    }

    public void setResponseType(ResponseType responseType) {
        this.responseType = responseType;
    }
    
}
