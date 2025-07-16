package com.promise.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "response_type_option")
public class ResponseTypeOption {
    @Id
    @Column(name = "response_option_id" , unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int responseOptionId;
    @ManyToOne
    @JoinColumn(name = "response_type_id")
    @JsonBackReference
    private ResponseType responseType;

    private int option_index;
    private String option_value;

    public ResponseTypeOption() {
    }

    public int getOption_index() {
        return option_index;
    }

    public void setOption_index(int option_index) {
        this.option_index = option_index;
    }

    public void setOption_value(String option_value) {
        this.option_value = option_value;
    }

    public String getOption_value() {
        return option_value;
    }

    public int getResponseOptionId() {
        return responseOptionId;
    }

    public void setResponseOptionId(int responseOptionId) {
        this.responseOptionId = responseOptionId;
    }

    public ResponseType getResponseType() {
        return responseType;
    }

    public void setResponseType(ResponseType responseType) {
        this.responseType = responseType;
    }
}
