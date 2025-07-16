package com.promise.demo.dto;

public class QuestionDTO {
    private Integer id;
    private String text;
    private int questionOrder;
    private Integer responseTypeId;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getResponseTypeId() {
        return responseTypeId;
    }

    public void setResponseTypeId(Integer responseTypeId) {
        this.responseTypeId = responseTypeId;
    }
}
