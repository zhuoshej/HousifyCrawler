package com.housify.zillowdatawasher.module;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.google.inject.AbstractModule;

public class SQSModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(AmazonSQS.class).toInstance(getSQSClient());
    }

    public AmazonSQS getSQSClient(){
        ProfileCredentialsProvider profileCredentialsProvider = new ProfileCredentialsProvider("./aws_config", "default");
        AmazonSQS sqs = AmazonSQSClientBuilder.standard()
                .withRegion(Regions.US_WEST_2)
                .withCredentials(profileCredentialsProvider)
                .build();

        return sqs;
    }
}
