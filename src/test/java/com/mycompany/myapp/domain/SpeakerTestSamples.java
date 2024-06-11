package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SpeakerTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Speaker getSpeakerSample1() {
        return new Speaker().id(1L).fullName("fullName1").email("email1").company("company1");
    }

    public static Speaker getSpeakerSample2() {
        return new Speaker().id(2L).fullName("fullName2").email("email2").company("company2");
    }

    public static Speaker getSpeakerRandomSampleGenerator() {
        return new Speaker()
            .id(longCount.incrementAndGet())
            .fullName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .company(UUID.randomUUID().toString());
    }
}
