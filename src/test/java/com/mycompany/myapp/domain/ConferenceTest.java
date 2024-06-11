package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ConferenceTestSamples.*;
import static com.mycompany.myapp.domain.SessionTestSamples.*;
import static com.mycompany.myapp.domain.SpeakerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ConferenceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Conference.class);
        Conference conference1 = getConferenceSample1();
        Conference conference2 = new Conference();
        assertThat(conference1).isNotEqualTo(conference2);

        conference2.setId(conference1.getId());
        assertThat(conference1).isEqualTo(conference2);

        conference2 = getConferenceSample2();
        assertThat(conference1).isNotEqualTo(conference2);
    }

    @Test
    void sessionTest() {
        Conference conference = getConferenceRandomSampleGenerator();
        Session sessionBack = getSessionRandomSampleGenerator();

        conference.addSession(sessionBack);
        assertThat(conference.getSessions()).containsOnly(sessionBack);
        assertThat(sessionBack.getConference()).isEqualTo(conference);

        conference.removeSession(sessionBack);
        assertThat(conference.getSessions()).doesNotContain(sessionBack);
        assertThat(sessionBack.getConference()).isNull();

        conference.sessions(new HashSet<>(Set.of(sessionBack)));
        assertThat(conference.getSessions()).containsOnly(sessionBack);
        assertThat(sessionBack.getConference()).isEqualTo(conference);

        conference.setSessions(new HashSet<>());
        assertThat(conference.getSessions()).doesNotContain(sessionBack);
        assertThat(sessionBack.getConference()).isNull();
    }

    @Test
    void speakerTest() {
        Conference conference = getConferenceRandomSampleGenerator();
        Speaker speakerBack = getSpeakerRandomSampleGenerator();

        conference.addSpeaker(speakerBack);
        assertThat(conference.getSpeakers()).containsOnly(speakerBack);
        assertThat(speakerBack.getConferences()).containsOnly(conference);

        conference.removeSpeaker(speakerBack);
        assertThat(conference.getSpeakers()).doesNotContain(speakerBack);
        assertThat(speakerBack.getConferences()).doesNotContain(conference);

        conference.speakers(new HashSet<>(Set.of(speakerBack)));
        assertThat(conference.getSpeakers()).containsOnly(speakerBack);
        assertThat(speakerBack.getConferences()).containsOnly(conference);

        conference.setSpeakers(new HashSet<>());
        assertThat(conference.getSpeakers()).doesNotContain(speakerBack);
        assertThat(speakerBack.getConferences()).doesNotContain(conference);
    }
}
