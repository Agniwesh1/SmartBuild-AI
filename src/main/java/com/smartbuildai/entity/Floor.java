package com.smartbuildai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"house_id", "floor_number"}))
public class Floor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String floorName;
    @Column(name = "floor_number", nullable = false) private Integer floorNumber;
    private Double area;
    private LocalDateTime createdAt;
    @ManyToOne @JoinColumn(name = "house_id", nullable = false) @JsonIgnore private House house;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getFloorName(){return floorName;} public void setFloorName(String v){floorName=v;}
    public Integer getFloorNumber(){return floorNumber;} public void setFloorNumber(Integer v){floorNumber=v;}
    public Double getArea(){return area;} public void setArea(Double v){area=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public House getHouse(){return house;} public void setHouse(House v){house=v;}
}
