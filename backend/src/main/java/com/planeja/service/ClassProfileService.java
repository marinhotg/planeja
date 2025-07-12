package com.planeja.service;

import com.planeja.model.ClassProfile;
import com.planeja.repository.ClassProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClassProfileService {

    @Autowired
    private ClassProfileRepository classProfileRepository;

    public List<ClassProfile> findAll() {
        return classProfileRepository.findAll();
    }

    public Optional<ClassProfile> findById(UUID id) {
        return classProfileRepository.findById(id);
    }

    public ClassProfile save(ClassProfile classProfile) {
        return classProfileRepository.save(classProfile);
    }

    public void deleteById(UUID id) {
        classProfileRepository.deleteById(id);
    }
}
