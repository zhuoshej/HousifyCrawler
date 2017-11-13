package com.housify.zillowdatawasher.DAO;

import com.housify.zillowdatawasher.models.House;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class HouseDataDAO {
    private Connection connection;

    public HouseDataDAO(String user, String password) throws SQLException{
        System.out.println("-------- MySQL JDBC Connection Testing ------------");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println("Where is your MySQL JDBC Driver?");
            e.printStackTrace();
            return;
        }

        System.out.println("MySQL JDBC Driver Registered!");

        connection = DriverManager.getConnection("jdbc:mysql://housedata.cp51dsaajrxm.us-west-2.rds.amazonaws.com:3306/housedata",user, password);

        if (connection != null) {
            System.out.println("Connected to the database: housedata");
        } else {
            System.out.println("Failed to make connection!");
        }
    }

    public void insertRegular(House house) throws SQLException{
        String query = " insert into regular (latitude, longitude, price, hoa, beds, baths, sqft, remodel, built, stories, state, city, zipcode, neighborhood, address, type, parking, view, lastupdatedate)"
                + " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // create the mysql insert preparedstatement
        PreparedStatement preparedStmt = connection.prepareStatement(query);
        preparedStmt.setFloat(1, (float) house.getLatitude());
        preparedStmt.setFloat(2, (float) house.getLongitude());
        preparedStmt.setFloat(3, (float) house.getPrice());
        preparedStmt.setFloat(4, (float) house.getHoa());
        preparedStmt.setFloat(5, (float) house.getBeds());
        preparedStmt.setFloat(6, (float) house.getBaths());
        preparedStmt.setFloat(7, (float) house.getSqft());
        preparedStmt.setFloat(8, (float) house.getRemodel());
        preparedStmt.setFloat(9, (float) house.getBuilt());
        preparedStmt.setFloat(10, (float) house.getStories());
        preparedStmt.setString(11, house.getState());
        preparedStmt.setString(12, house.getCity());
        preparedStmt.setString(13, house.getZipcode());
        preparedStmt.setString(14, house.getNeighborhood());
        preparedStmt.setString(15, house.getAddress());
        preparedStmt.setString(16, house.getType());
        preparedStmt.setString(17, house.getParking());
        preparedStmt.setString(18, house.getView());
        preparedStmt.setString(19, house.getLastupdatedate());

        preparedStmt.execute();
    }

    public void close() throws SQLException{
        if(connection != null){
            connection.close();
        }
    }
}
