package com.promise.demo.dto;

public class SectionDTO {
    private Integer id;
    private String text;
    private int sectionOrder;
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

    public int getSectionOrder() {
        return sectionOrder;
    }

    public void setSectionOrder(int sectionOrder) {
        this.sectionOrder = sectionOrder;
    }

    public Integer getResponseTypeId() {
        return responseTypeId;
    }

    public void setResponseTypeId(Integer responseTypeId) {
        this.responseTypeId = responseTypeId;
    }
}
