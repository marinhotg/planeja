package com.planeja.repository;

import com.planeja.model.ClassProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassProfileRepository extends JpaRepository<ClassProfile, UUID> {
    List<ClassProfile> findByUserId(UUID userId);
    Optional<ClassProfile> findByIdAndUserId(UUID id, UUID userId);
}
