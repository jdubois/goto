package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Session.
 */
@Entity
@Table(name = "session")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Session implements Serializable {

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

    @Column(name = "room")
    private String room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "sessions", "conferences" }, allowSetters = true)
    private Speaker speaker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "sessions", "speakers" }, allowSetters = true)
    private Conference conference;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "sessions")
    @JsonIgnoreProperties(value = { "sessions" }, allowSetters = true)
    private Set<Attendee> attendees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Session id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Session title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Session description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRoom() {
        return this.room;
    }

    public Session room(String room) {
        this.setRoom(room);
        return this;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Speaker getSpeaker() {
        return this.speaker;
    }

    public void setSpeaker(Speaker speaker) {
        this.speaker = speaker;
    }

    public Session speaker(Speaker speaker) {
        this.setSpeaker(speaker);
        return this;
    }

    public Conference getConference() {
        return this.conference;
    }

    public void setConference(Conference conference) {
        this.conference = conference;
    }

    public Session conference(Conference conference) {
        this.setConference(conference);
        return this;
    }

    public Set<Attendee> getAttendees() {
        return this.attendees;
    }

    public void setAttendees(Set<Attendee> attendees) {
        if (this.attendees != null) {
            this.attendees.forEach(i -> i.removeSession(this));
        }
        if (attendees != null) {
            attendees.forEach(i -> i.addSession(this));
        }
        this.attendees = attendees;
    }

    public Session attendees(Set<Attendee> attendees) {
        this.setAttendees(attendees);
        return this;
    }

    public Session addAttendee(Attendee attendee) {
        this.attendees.add(attendee);
        attendee.getSessions().add(this);
        return this;
    }

    public Session removeAttendee(Attendee attendee) {
        this.attendees.remove(attendee);
        attendee.getSessions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Session)) {
            return false;
        }
        return getId() != null && getId().equals(((Session) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Session{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", room='" + getRoom() + "'" +
            "}";
    }
}
