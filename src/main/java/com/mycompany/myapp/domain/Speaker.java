package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Speaker.
 */
@Entity
@Table(name = "speaker")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Speaker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "company")
    private String company;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "speaker")
    @JsonIgnoreProperties(value = { "speaker", "conference", "attendees" }, allowSetters = true)
    private Set<Session> sessions = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_speaker__conference",
        joinColumns = @JoinColumn(name = "speaker_id"),
        inverseJoinColumns = @JoinColumn(name = "conference_id")
    )
    @JsonIgnoreProperties(value = { "sessions", "speakers" }, allowSetters = true)
    private Set<Conference> conferences = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Speaker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return this.fullName;
    }

    public Speaker fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return this.email;
    }

    public Speaker email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompany() {
        return this.company;
    }

    public Speaker company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Set<Session> getSessions() {
        return this.sessions;
    }

    public void setSessions(Set<Session> sessions) {
        if (this.sessions != null) {
            this.sessions.forEach(i -> i.setSpeaker(null));
        }
        if (sessions != null) {
            sessions.forEach(i -> i.setSpeaker(this));
        }
        this.sessions = sessions;
    }

    public Speaker sessions(Set<Session> sessions) {
        this.setSessions(sessions);
        return this;
    }

    public Speaker addSession(Session session) {
        this.sessions.add(session);
        session.setSpeaker(this);
        return this;
    }

    public Speaker removeSession(Session session) {
        this.sessions.remove(session);
        session.setSpeaker(null);
        return this;
    }

    public Set<Conference> getConferences() {
        return this.conferences;
    }

    public void setConferences(Set<Conference> conferences) {
        this.conferences = conferences;
    }

    public Speaker conferences(Set<Conference> conferences) {
        this.setConferences(conferences);
        return this;
    }

    public Speaker addConference(Conference conference) {
        this.conferences.add(conference);
        return this;
    }

    public Speaker removeConference(Conference conference) {
        this.conferences.remove(conference);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Speaker)) {
            return false;
        }
        return getId() != null && getId().equals(((Speaker) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Speaker{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", email='" + getEmail() + "'" +
            ", company='" + getCompany() + "'" +
            "}";
    }
}
