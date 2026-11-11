package com.smartbuildai.dto;
public class FloorRequestDTO {
 private String floorName; private Integer floorNumber; private Double area; private Long houseId;
 public String getFloorName(){return floorName;} public void setFloorName(String v){floorName=v;}
 public Integer getFloorNumber(){return floorNumber;} public void setFloorNumber(Integer v){floorNumber=v;}
 public Double getArea(){return area;} public void setArea(Double v){area=v;}
 public Long getHouseId(){return houseId;} public void setHouseId(Long v){houseId=v;}
}
