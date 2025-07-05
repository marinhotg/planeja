package com.planeja.model;

import java.util.List;

public class BNCCSearchResponse {

    private List<BNCCContent> results;

    public BNCCSearchResponse(List<BNCCContent> results) {
        this.results = results;
    }

    public List<BNCCContent> getResults() {
        return results;
    }

    public void setResults(List<BNCCContent> results) {
        this.results = results;
    }
}
