package com.housify.zillowdatawasher.module;

import com.google.inject.AbstractModule;
import com.housify.zillowdatawasher.gateways.SQSGateway;

public class MainModule extends AbstractModule {
    @Override
    protected void configure() {
        install(new SQSModule());
        bind(SQSGateway.class);
    }
}
