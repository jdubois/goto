package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Conference.
 */
@Entity
@Table(name = "conference")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Conference implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "palce")
    private String palce;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "conference")
    @JsonIgnoreProperties(value = { "speaker", "conference", "attendees" }, allowSetters = true)
    private Set<Session> sessions = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "conferences")
    @JsonIgnoreProperties(value = { "sessions", "conferences" }, allowSetters = true)
    private Set<Speaker> speakers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Conference id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Conference title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Conference description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Conference date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPalce() {
        return this.palce;
    }

    public Conference palce(String palce) {
        this.setPalce(palce);
        return this;
    }

    public void setPalce(String palce) {
        this.palce = palce;
    }

    public Set<Session> getSessions() {
        return this.sessions;
    }

    public void setSessions(Set<Session> sessions) {
        if (this.sessions != null) {
            this.sessions.forEach(i -> i.setConference(null));
        }
        if (sessions != null) {
            sessions.forEach(i -> i.setConference(this));
        }
        this.sessions = sessions;
    }

    public Conference sessions(Set<Session> sessions) {
        this.setSessions(sessions);
        return this;
    }

    public Conference addSession(Session session) {
        this.sessions.add(session);
        session.setConference(this);
        return this;
    }

    public Conference removeSession(Session session) {
        this.sessions.remove(session);
        session.setConference(null);
        return this;
    }

    public Set<Speaker> getSpeakers() {
        return this.speakers;
    }

    public void setSpeakers(Set<Speaker> speakers) {
        if (this.speakers != null) {
            this.speakers.forEach(i -> i.removeConference(this));
        }
        if (speakers != null) {
            speakers.forEach(i -> i.addConference(this));
        }
        this.speakers = speakers;
    }

    public Conference speakers(Set<Speaker> speakers) {
        this.setSpeakers(speakers);
        return this;
    }

    public Conference addSpeaker(Speaker speaker) {
        this.speakers.add(speaker);
        speaker.getConferences().add(this);
        return this;
    }

    public Conference removeSpeaker(Speaker speaker) {
        this.speakers.remove(speaker);
        speaker.getConferences().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Conference)) {
            return false;
        }
        return getId() != null && getId().equals(((Conference) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Conference{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", palce='" + getPalce() + "'" +
            "}";
    }
}
