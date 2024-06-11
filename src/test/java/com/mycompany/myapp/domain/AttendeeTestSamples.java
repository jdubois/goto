package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AttendeeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Attendee getAttendeeSample1() {
        return new Attendee().id(1L).firstName("firstName1").lastName("lastName1").email("email1").telephone("telephone1");
    }

    public static Attendee getAttendeeSample2() {
        return new Attendee().id(2L).firstName("firstName2").lastName("lastName2").email("email2").telephone("telephone2");
    }

    public static Attendee getAttendeeRandomSampleGenerator() {
        return new Attendee()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
