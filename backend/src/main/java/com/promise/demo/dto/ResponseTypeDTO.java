package com.promise.demo.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.promise.demo.model.ResponseTypeOption;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

import java.util.List;

public class ResponseTypeDTO {
    private String inputType;
    private String responseTypeName;
    private String responseScale;
    private List<OptionDTO> options;


    public static class OptionDTO {
        private int index;
        private String value;

        public int getIndex() { return index; }
        public void setIndex(int index) { this.index = index; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    public String getInputType() { return inputType; }
    public void setInputType(String inputType) { this.inputType = inputType; }

    public String getResponseTypeName() { return responseTypeName; }
    public void setResponseTypeName(String responseTypeName) { this.responseTypeName = responseTypeName; }

    public String getResponseScale() { return responseScale; }
    public void setResponseScale(String responseScale) { this.responseScale = responseScale; }

    public List<OptionDTO> getOptions() { return options; }
    public void setOptions(List<OptionDTO> options) { this.options = options; }
}
