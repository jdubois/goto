package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttendeeTestSamples.*;
import static com.mycompany.myapp.domain.SessionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AttendeeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attendee.class);
        Attendee attendee1 = getAttendeeSample1();
        Attendee attendee2 = new Attendee();
        assertThat(attendee1).isNotEqualTo(attendee2);

        attendee2.setId(attendee1.getId());
        assertThat(attendee1).isEqualTo(attendee2);

        attendee2 = getAttendeeSample2();
        assertThat(attendee1).isNotEqualTo(attendee2);
    }

    @Test
    void sessionTest() {
        Attendee attendee = getAttendeeRandomSampleGenerator();
        Session sessionBack = getSessionRandomSampleGenerator();

        attendee.addSession(sessionBack);
        assertThat(attendee.getSessions()).containsOnly(sessionBack);

        attendee.removeSession(sessionBack);
        assertThat(attendee.getSessions()).doesNotContain(sessionBack);

        attendee.sessions(new HashSet<>(Set.of(sessionBack)));
        assertThat(attendee.getSessions()).containsOnly(sessionBack);

        attendee.setSessions(new HashSet<>());
        assertThat(attendee.getSessions()).doesNotContain(sessionBack);
    }
}
