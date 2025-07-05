package com.planeja.controller;

import com.planeja.model.BNCCContent;
import com.planeja.model.BNCCSearchRequest;
import com.planeja.service.BNCCSearchService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bncc")
public class BNCCSearchController {

    private final BNCCSearchService bnccSearchService;

    public BNCCSearchController(BNCCSearchService bnccSearchService) {
        this.bnccSearchService = bnccSearchService;
    }

    @PostMapping("/search")
    public List<BNCCContent> search(@RequestBody BNCCSearchRequest request) {
        return bnccSearchService.searchWithFilters(request.getQuery(), request.getArea(), request.getEtapa(), request.getTopK());
    }

    @PostMapping("/search/eja")
    public List<BNCCContent> searchEJA(@RequestBody BNCCSearchRequest request) {
        return bnccSearchService.searchForEJA(request.getQuery(), request.getArea(), request.getEtapa());
    }
}
