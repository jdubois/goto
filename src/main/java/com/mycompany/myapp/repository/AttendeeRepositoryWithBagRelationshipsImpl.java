package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Attendee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AttendeeRepositoryWithBagRelationshipsImpl implements AttendeeRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String ATTENDEES_PARAMETER = "attendees";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Attendee> fetchBagRelationships(Optional<Attendee> attendee) {
        return attendee.map(this::fetchSessions);
    }

    @Override
    public Page<Attendee> fetchBagRelationships(Page<Attendee> attendees) {
        return new PageImpl<>(fetchBagRelationships(attendees.getContent()), attendees.getPageable(), attendees.getTotalElements());
    }

    @Override
    public List<Attendee> fetchBagRelationships(List<Attendee> attendees) {
        return Optional.of(attendees).map(this::fetchSessions).orElse(Collections.emptyList());
    }

    Attendee fetchSessions(Attendee result) {
        return entityManager
            .createQuery("select attendee from Attendee attendee left join fetch attendee.sessions where attendee.id = :id", Attendee.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Attendee> fetchSessions(List<Attendee> attendees) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, attendees.size()).forEach(index -> order.put(attendees.get(index).getId(), index));
        List<Attendee> result = entityManager
            .createQuery(
                "select attendee from Attendee attendee left join fetch attendee.sessions where attendee in :attendees",
                Attendee.class
            )
            .setParameter(ATTENDEES_PARAMETER, attendees)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
