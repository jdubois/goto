package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SessionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Session getSessionSample1() {
        return new Session().id(1L).title("title1").description("description1").room("room1");
    }

    public static Session getSessionSample2() {
        return new Session().id(2L).title("title2").description("description2").room("room2");
    }

    public static Session getSessionRandomSampleGenerator() {
        return new Session()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .room(UUID.randomUUID().toString());
    }
}
