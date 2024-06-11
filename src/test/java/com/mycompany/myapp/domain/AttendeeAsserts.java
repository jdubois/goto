package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class AttendeeAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAttendeeAllPropertiesEquals(Attendee expected, Attendee actual) {
        assertAttendeeAutoGeneratedPropertiesEquals(expected, actual);
        assertAttendeeAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAttendeeAllUpdatablePropertiesEquals(Attendee expected, Attendee actual) {
        assertAttendeeUpdatableFieldsEquals(expected, actual);
        assertAttendeeUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAttendeeAutoGeneratedPropertiesEquals(Attendee expected, Attendee actual) {
        assertThat(expected)
            .as("Verify Attendee auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAttendeeUpdatableFieldsEquals(Attendee expected, Attendee actual) {
        assertThat(expected)
            .as("Verify Attendee relevant properties")
            .satisfies(e -> assertThat(e.getFirstName()).as("check firstName").isEqualTo(actual.getFirstName()))
            .satisfies(e -> assertThat(e.getLastName()).as("check lastName").isEqualTo(actual.getLastName()))
            .satisfies(e -> assertThat(e.getEmail()).as("check email").isEqualTo(actual.getEmail()))
            .satisfies(e -> assertThat(e.getTelephone()).as("check telephone").isEqualTo(actual.getTelephone()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAttendeeUpdatableRelationshipsEquals(Attendee expected, Attendee actual) {
        assertThat(expected)
            .as("Verify Attendee relationships")
            .satisfies(e -> assertThat(e.getSessions()).as("check sessions").isEqualTo(actual.getSessions()));
    }
}