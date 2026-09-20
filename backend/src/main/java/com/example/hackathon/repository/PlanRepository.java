package com.example.hackathon.repository;

import com.example.hackathon.entity.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PlanRepository extends JpaRepository<PlanEntity, UUID> {
}