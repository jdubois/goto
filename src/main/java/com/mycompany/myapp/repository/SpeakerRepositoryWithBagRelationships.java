package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Speaker;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SpeakerRepositoryWithBagRelationships {
    Optional<Speaker> fetchBagRelationships(Optional<Speaker> speaker);

    List<Speaker> fetchBagRelationships(List<Speaker> speakers);

    Page<Speaker> fetchBagRelationships(Page<Speaker> speakers);
}
