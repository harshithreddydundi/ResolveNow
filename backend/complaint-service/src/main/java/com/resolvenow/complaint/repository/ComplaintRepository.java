package com.resolvenow.complaint.repository;

import com.resolvenow.complaint.entity.Category;
import com.resolvenow.complaint.entity.Complaint;
import com.resolvenow.complaint.entity.Priority;
import com.resolvenow.complaint.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByTicketNumber(String ticketNumber);

    List<Complaint> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Complaint> findByAssignedAgentIdOrderByCreatedAtDesc(Long agentId);

    List<Complaint> findByStatusOrderByCreatedAtDesc(Status status);

    List<Complaint> findByDepartmentOrderByCreatedAtDesc(String department);

    List<Complaint> findByPriorityOrderByCreatedAtDesc(Priority priority);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(cast(:search as string) IS NULL OR LOWER(c.ticketNumber) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(c.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(c.customerName) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(c.department) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(c.assignedAgentName) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:priority IS NULL OR c.priority = :priority) " +
           "AND (cast(:department as string) IS NULL OR c.department = cast(:department as string)) " +
           "AND (:customerId IS NULL OR c.customerId = :customerId) " +
           "AND (:agentId IS NULL OR c.assignedAgentId = :agentId)")
    Page<Complaint> searchComplaints(
            @Param("search") String search,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            @Param("department") String department,
            @Param("customerId") Long customerId,
            @Param("agentId") Long agentId,
            Pageable pageable);

    long countByStatus(Status status);

    long countByPriority(Priority priority);

    long countByDepartment(String department);

    long countByCategory(Category category);

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
    List<Object[]> countGroupByPriority();

    @Query("SELECT c.department, COUNT(c) FROM Complaint c WHERE c.department IS NOT NULL GROUP BY c.department")
    List<Object[]> countGroupByDepartment();

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countGroupByCategory();

    long countByCreatedAtAfter(LocalDateTime dateTime);

    long countByResolvedAtAfter(LocalDateTime dateTime);
}
