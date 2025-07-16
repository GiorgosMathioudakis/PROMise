package com.promise.demo.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.List;

public class UpdateResponseTypeDTO {
    public Integer responseTypeId;
    private String responseTypeName;
    private List<OptionUpdateDTO> options;

    public static class OptionUpdateDTO {
        private int responseOptionId;
        private int option_index;
        private String option_value;

        public int getResponseOptionId() {
            return responseOptionId;
        }

        public void setResponseOptionId(int responseOptionId) {
            this.responseOptionId = responseOptionId;
        }

        public int getOption_index() {
            return option_index;
        }

        public void setOption_index(int option_index) {
            this.option_index = option_index;
        }

        public String getOption_value() {
            return option_value;
        }

        public void setOption_value(String option_value) {
            this.option_value = option_value;
        }
    }

    public Integer getResponseTypeId() {
        return responseTypeId;
    }

    public void setResponseTypeId(Integer responseTypeId) {
        this.responseTypeId = responseTypeId;
    }

    public String getResponseTypeName() {
        return responseTypeName;
    }

    public void setResponseTypeName(String responseTypeName) {
        this.responseTypeName = responseTypeName;
    }

    public List<OptionUpdateDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionUpdateDTO> options) {
        this.options = options;
    }
}
