package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ConferenceTestSamples.*;
import static com.mycompany.myapp.domain.SessionTestSamples.*;
import static com.mycompany.myapp.domain.SpeakerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SpeakerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Speaker.class);
        Speaker speaker1 = getSpeakerSample1();
        Speaker speaker2 = new Speaker();
        assertThat(speaker1).isNotEqualTo(speaker2);

        speaker2.setId(speaker1.getId());
        assertThat(speaker1).isEqualTo(speaker2);

        speaker2 = getSpeakerSample2();
        assertThat(speaker1).isNotEqualTo(speaker2);
    }

    @Test
    void sessionTest() {
        Speaker speaker = getSpeakerRandomSampleGenerator();
        Session sessionBack = getSessionRandomSampleGenerator();

        speaker.addSession(sessionBack);
        assertThat(speaker.getSessions()).containsOnly(sessionBack);
        assertThat(sessionBack.getSpeaker()).isEqualTo(speaker);

        speaker.removeSession(sessionBack);
        assertThat(speaker.getSessions()).doesNotContain(sessionBack);
        assertThat(sessionBack.getSpeaker()).isNull();

        speaker.sessions(new HashSet<>(Set.of(sessionBack)));
        assertThat(speaker.getSessions()).containsOnly(sessionBack);
        assertThat(sessionBack.getSpeaker()).isEqualTo(speaker);

        speaker.setSessions(new HashSet<>());
        assertThat(speaker.getSessions()).doesNotContain(sessionBack);
        assertThat(sessionBack.getSpeaker()).isNull();
    }

    @Test
    void conferenceTest() {
        Speaker speaker = getSpeakerRandomSampleGenerator();
        Conference conferenceBack = getConferenceRandomSampleGenerator();

        speaker.addConference(conferenceBack);
        assertThat(speaker.getConferences()).containsOnly(conferenceBack);

        speaker.removeConference(conferenceBack);
        assertThat(speaker.getConferences()).doesNotContain(conferenceBack);

        speaker.conferences(new HashSet<>(Set.of(conferenceBack)));
        assertThat(speaker.getConferences()).containsOnly(conferenceBack);

        speaker.setConferences(new HashSet<>());
        assertThat(speaker.getConferences()).doesNotContain(conferenceBack);
    }
}
