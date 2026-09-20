package com.resolvenow.assignment.repository;

import com.resolvenow.assignment.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    Optional<Assignment> findByComplaintId(Long complaintId);

    List<Assignment> findByAgentId(Long agentId);

    List<Assignment> findByDepartment(String department);

    @Query("SELECT a.agentId, a.agentName, a.department, COUNT(a) FROM Assignment a " +
           "WHERE a.agentId IS NOT NULL AND a.status IN ('ASSIGNED', 'IN_PROGRESS', 'ESCALATED') " +
           "GROUP BY a.agentId, a.agentName, a.department")
    List<Object[]> getAgentWorkloads();
}
