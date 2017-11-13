package com.housify.zillowdatawasher.models;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
public class House {
    private double latitude;
    private double longitude;
    private double price;
    private double hoa;
    private double beds;
    private double baths;
    private double sqft;
    private double remodel;
    private double built;
    private double stories;
    private String state;
    private String city;
    private String zipcode;
    private String neighborhood;
    private String address;
    private String type;
    private String parking;
    private String view;
    private String lastupdatedate;
}
