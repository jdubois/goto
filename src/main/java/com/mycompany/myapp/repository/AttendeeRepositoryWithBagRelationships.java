package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Attendee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AttendeeRepositoryWithBagRelationships {
    Optional<Attendee> fetchBagRelationships(Optional<Attendee> attendee);

    List<Attendee> fetchBagRelationships(List<Attendee> attendees);

    Page<Attendee> fetchBagRelationships(Page<Attendee> attendees);
}
