package com.promise.demo.controller;

import com.promise.demo.dto.ResponseTypeDTO;
import com.promise.demo.dto.UpdateResponseTypeDTO;
import com.promise.demo.model.ResponseType;
import com.promise.demo.model.ResponseTypeOption;
import com.promise.demo.repository.ResponseTypeOptionRepository;
import com.promise.demo.repository.ResponseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/responseTypes")
public class ResponseTypeController {

    private final ResponseTypeOptionRepository optionRepository;

    @Autowired
    private ResponseTypeRepository responseTypeRepository;

    @Autowired
    private ResponseTypeOptionRepository responseTypeOptionRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createResponseType(@RequestBody ResponseTypeDTO dto) {
        ResponseType responseType = new ResponseType();
        responseType.setInputType(dto.getInputType());
        responseType.setResponseTypeName(dto.getResponseTypeName());

        // Save ResponseType first to get ID
        responseTypeRepository.save(responseType);

        if (dto.getOptions() != null) {
            for (ResponseTypeDTO.OptionDTO opt : dto.getOptions()) {
                ResponseTypeOption option = new ResponseTypeOption();
                option.setOption_index(opt.getIndex());
                option.setOption_value(opt.getValue());
                option.setResponseType(responseType);
                responseTypeOptionRepository.save(option);
            }
        }

        return ResponseEntity.ok("Response Type created successfully");
    }

    public ResponseTypeController(ResponseTypeOptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

    @GetMapping("/options")
    public Map<Integer, List<Map<String, Object>>> getOptionsByResponseTypeIds(@RequestParam List<Integer> ids) {
        List<ResponseTypeOption> options = optionRepository.findByResponseTypeIds(ids);

        return options.stream().collect(Collectors.groupingBy(
                opt -> opt.getResponseType().getResponseTypeId(),
                Collectors.mapping(opt -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", opt.getResponseOptionId());
                    map.put("index", opt.getOption_index());
                    map.put("label", opt.getOption_value());
                    return map;
                }, Collectors.toList())
        ));
    }

    // Insert a new ResponseType
//    @PostMapping
//    public String createResponseType(@RequestBody ResponseType responseType) {
//        responseTypeRepository.save(responseType);
//        return "ResponseType saved!";
//    }


    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/existsByName")
    public ResponseEntity<Boolean> checkIfResponseTypeNameExists(@RequestParam String name) {
        boolean exists = responseTypeRepository.findByResponseTypeNameIgnoreCase(name).isPresent();
        return ResponseEntity.ok(exists);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/search")
    public List<Map<String, Object>> searchResponseTypes(@RequestParam String query) {
        List<ResponseType> results = responseTypeRepository.findByResponseTypeNameContainingIgnoreCase(query);
        return results.stream()
                .map(rt -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", rt.getResponseTypeId());
                    map.put("responseTypeName", rt.getResponseTypeName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/byName")
    public ResponseEntity<ResponseType> getByName(@RequestParam String name) {
        return responseTypeRepository.findByResponseTypeNameIgnoreCase(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ResponseType> getAllResponseTypes() {
        return responseTypeRepository.findAll();
    }

    @PutMapping("/update")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> updateResponseType(@RequestBody UpdateResponseTypeDTO dto) {
        Optional<ResponseType> optResponseType = responseTypeRepository.findById(dto.getResponseTypeId());

        if (optResponseType.isEmpty()) {
            return ResponseEntity.badRequest().body("Response type not found.");
        }

        ResponseType responseType = optResponseType.get();
        responseType.setResponseTypeName(dto.getResponseTypeName());

        // Clear and update options
        List<ResponseTypeOption> updatedOptions = dto.getOptions().stream().map(optDto -> {
            ResponseTypeOption option = new ResponseTypeOption();

            if (optDto.getResponseOptionId() >= 0) {
                option.setResponseOptionId(optDto.getResponseOptionId());
            }

            option.setOption_index(optDto.getOption_index());
            option.setOption_value(optDto.getOption_value());
            option.setResponseType(responseType);
            return option;
        }).toList();

        // Clear old and replace with new
        responseType.getOptions().clear();
        responseType.getOptions().addAll(updatedOptions);

        responseTypeRepository.save(responseType);
        return ResponseEntity.ok("Response type updated successfully.");
    }

}
