package com.resolvenow.complaint.repository;

import com.resolvenow.complaint.entity.ComplaintActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintActivityRepository extends JpaRepository<ComplaintActivity, Long> {

    List<ComplaintActivity> findByComplaintIdOrderByTimestampDesc(Long complaintId);

    void deleteByComplaintId(Long complaintId);
}
