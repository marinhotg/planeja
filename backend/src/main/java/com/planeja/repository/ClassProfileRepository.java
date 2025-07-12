package com.planeja.repository;

import com.planeja.model.ClassProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ClassProfileRepository extends JpaRepository<ClassProfile, UUID> {
}
