package com.housify.zillowdatawasher;

import com.amazonaws.services.sqs.model.Message;
import com.google.gson.Gson;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.housify.zillowdatawasher.DAO.HouseDataDAO;
import com.housify.zillowdatawasher.gateways.SQSGateway;
import com.housify.zillowdatawasher.models.House;
import com.housify.zillowdatawasher.module.MainModule;

import java.io.File;
import java.io.FileInputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

public class App 
{
    public static void main( String[] args )
    {
        Injector injector = Guice.createInjector(new MainModule());
        SQSGateway sqsGateway = injector.getInstance(SQSGateway.class);
        try {
            File file = new File("./database_config");
            FileInputStream fileInput = new FileInputStream(file);
            Properties properties = new Properties();
            properties.load(fileInput);
            fileInput.close();
        } catch (Exception e) {
            System.out.println("Unknown exception while loading config file: " + e);
        }

        String queueURL = sqsGateway.getURL("PostSoldHousingData");

//        String testString = "{\"id\":\"80117700_zpid\",\"latitude\":\"47616026\",\"longitude\":\"-122335701\",\"state\":\"Washington\",\"city\":\"Seattle\",\"zipcode\":\"98101\",\"neighborhood\":\"Denny Triangle\",\"address\":\"819 Virginia Street UNIT 2902\",\"price\":1018000,\"type\":\"Condo\",\"built\":2007,\"parking\":\"Attached Garage, 2 spaces\",\"beds\":2,\"baths\":1.5,\"sqft\":1316,\"remodel\":2007,\"stories\":0,\"lastupdatedate\":\"10/13/17\"}";
        Gson gson = new Gson();

        try {
            HouseDataDAO houseDataDAO = new HouseDataDAO();
            List<Message> messageList = sqsGateway.getMessage(queueURL);
            while(messageList != null && messageList.size() != 0){
                for(Message message: messageList){
                    System.out.println(message.getBody());
                    House house = gson.fromJson(message.getBody(), House.class);
                    houseDataDAO.insertRegular(house);
                    sqsGateway.delete(queueURL, message.getReceiptHandle());
                }
                messageList = sqsGateway.getMessage(queueURL);
            }

            houseDataDAO.close();
        } catch (SQLException e){
            System.out.println(e);
            return;
        }

        System.exit(0);
    }
}
