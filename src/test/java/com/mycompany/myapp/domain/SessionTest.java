package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttendeeTestSamples.*;
import static com.mycompany.myapp.domain.ConferenceTestSamples.*;
import static com.mycompany.myapp.domain.SessionTestSamples.*;
import static com.mycompany.myapp.domain.SpeakerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SessionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Session.class);
        Session session1 = getSessionSample1();
        Session session2 = new Session();
        assertThat(session1).isNotEqualTo(session2);

        session2.setId(session1.getId());
        assertThat(session1).isEqualTo(session2);

        session2 = getSessionSample2();
        assertThat(session1).isNotEqualTo(session2);
    }

    @Test
    void speakerTest() {
        Session session = getSessionRandomSampleGenerator();
        Speaker speakerBack = getSpeakerRandomSampleGenerator();

        session.setSpeaker(speakerBack);
        assertThat(session.getSpeaker()).isEqualTo(speakerBack);

        session.speaker(null);
        assertThat(session.getSpeaker()).isNull();
    }

    @Test
    void conferenceTest() {
        Session session = getSessionRandomSampleGenerator();
        Conference conferenceBack = getConferenceRandomSampleGenerator();

        session.setConference(conferenceBack);
        assertThat(session.getConference()).isEqualTo(conferenceBack);

        session.conference(null);
        assertThat(session.getConference()).isNull();
    }

    @Test
    void attendeeTest() {
        Session session = getSessionRandomSampleGenerator();
        Attendee attendeeBack = getAttendeeRandomSampleGenerator();

        session.addAttendee(attendeeBack);
        assertThat(session.getAttendees()).containsOnly(attendeeBack);
        assertThat(attendeeBack.getSessions()).containsOnly(session);

        session.removeAttendee(attendeeBack);
        assertThat(session.getAttendees()).doesNotContain(attendeeBack);
        assertThat(attendeeBack.getSessions()).doesNotContain(session);

        session.attendees(new HashSet<>(Set.of(attendeeBack)));
        assertThat(session.getAttendees()).containsOnly(attendeeBack);
        assertThat(attendeeBack.getSessions()).containsOnly(session);

        session.setAttendees(new HashSet<>());
        assertThat(session.getAttendees()).doesNotContain(attendeeBack);
        assertThat(attendeeBack.getSessions()).doesNotContain(session);
    }
}
