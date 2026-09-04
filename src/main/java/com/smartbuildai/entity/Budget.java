package com.smartbuildai.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalBudget;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "house_id")
    private House house;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }
}