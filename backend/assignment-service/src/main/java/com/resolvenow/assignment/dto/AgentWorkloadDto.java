package com.resolvenow.assignment.dto;

public class AgentWorkloadDto {

    private Long agentId;
    private String agentName;
    private String department;
    private long activeTickets;
    private String workloadStatus; // LOW, OPTIMAL, HIGH, OVERLOADED

    public AgentWorkloadDto() {
    }

    public AgentWorkloadDto(Long agentId, String agentName, String department, long activeTickets) {
        this.agentId = agentId;
        this.agentName = agentName;
        this.department = department;
        this.activeTickets = activeTickets;
        this.workloadStatus = calculateStatus(activeTickets);
    }

    private String calculateStatus(long count) {
        if (count <= 2) return "LOW";
        if (count <= 5) return "OPTIMAL";
        if (count <= 8) return "HIGH";
        return "OVERLOADED";
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public long getActiveTickets() {
        return activeTickets;
    }

    public void setActiveTickets(long activeTickets) {
        this.activeTickets = activeTickets;
        this.workloadStatus = calculateStatus(activeTickets);
    }

    public String getWorkloadStatus() {
        return workloadStatus;
    }

    public void setWorkloadStatus(String workloadStatus) {
        this.workloadStatus = workloadStatus;
    }
}
