package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ConferenceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Conference getConferenceSample1() {
        return new Conference().id(1L).title("title1").description("description1").palce("palce1");
    }

    public static Conference getConferenceSample2() {
        return new Conference().id(2L).title("title2").description("description2").palce("palce2");
    }

    public static Conference getConferenceRandomSampleGenerator() {
        return new Conference()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .palce(UUID.randomUUID().toString());
    }
}
