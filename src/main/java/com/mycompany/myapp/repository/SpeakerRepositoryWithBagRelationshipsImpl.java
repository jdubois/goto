package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Speaker;
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
public class SpeakerRepositoryWithBagRelationshipsImpl implements SpeakerRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String SPEAKERS_PARAMETER = "speakers";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Speaker> fetchBagRelationships(Optional<Speaker> speaker) {
        return speaker.map(this::fetchConferences);
    }

    @Override
    public Page<Speaker> fetchBagRelationships(Page<Speaker> speakers) {
        return new PageImpl<>(fetchBagRelationships(speakers.getContent()), speakers.getPageable(), speakers.getTotalElements());
    }

    @Override
    public List<Speaker> fetchBagRelationships(List<Speaker> speakers) {
        return Optional.of(speakers).map(this::fetchConferences).orElse(Collections.emptyList());
    }

    Speaker fetchConferences(Speaker result) {
        return entityManager
            .createQuery("select speaker from Speaker speaker left join fetch speaker.conferences where speaker.id = :id", Speaker.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Speaker> fetchConferences(List<Speaker> speakers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, speakers.size()).forEach(index -> order.put(speakers.get(index).getId(), index));
        List<Speaker> result = entityManager
            .createQuery(
                "select speaker from Speaker speaker left join fetch speaker.conferences where speaker in :speakers",
                Speaker.class
            )
            .setParameter(SPEAKERS_PARAMETER, speakers)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
