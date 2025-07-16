package com.promise.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "response_type")
public class ResponseType {
    @Id
    @Column(name = "response_type_id" , unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int responseTypeId;
    private String inputType;
    private String responseTypeName;

    @OneToMany(mappedBy = "responseType", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ResponseTypeOption> options;

    public List<ResponseTypeOption> getOptions() {
        return options;
    }

    public void setOptions(List<ResponseTypeOption> options) {
        this.options = options;
    }

    public ResponseType() {
    }

    public ResponseType(int responseTypeId) {
        this.responseTypeId = responseTypeId;
    }

    public int getResponseTypeId() {
        return responseTypeId;
    }

    public void setResponseTypeId(int responseTypeId) {
        this.responseTypeId = responseTypeId;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getResponseTypeName() {
        return responseTypeName;
    }

    public void setResponseTypeName(String responseTypeName) {
        this.responseTypeName = responseTypeName;
    }

}
