package com.housify.zillowdatawasher.gateways;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.DeleteMessageRequest;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;
import com.google.inject.Inject;

import java.util.List;

public class SQSGateway {
    private AmazonSQS sqsClient;

    @Inject
    public SQSGateway(AmazonSQS sqsClient){
        this.sqsClient = sqsClient;
    }

    public String getURL(String queueName){
        return sqsClient.getQueueUrl(queueName).getQueueUrl();
    }

    public List<Message> getMessage(String queueURL){
        return sqsClient.receiveMessage(new ReceiveMessageRequest().withMaxNumberOfMessages(10).withQueueUrl(queueURL)).getMessages();
    }

    public void delete(String queueURL, String receiptHandle){
        sqsClient.deleteMessage(new DeleteMessageRequest()
                .withQueueUrl(queueURL)
                .withReceiptHandle(receiptHandle));
    }
}
