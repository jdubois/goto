package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Attendee;
import com.mycompany.myapp.repository.AttendeeRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Attendee}.
 */
@RestController
@RequestMapping("/api/attendees")
@Transactional
public class AttendeeResource {

    private final Logger log = LoggerFactory.getLogger(AttendeeResource.class);

    private static final String ENTITY_NAME = "attendee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AttendeeRepository attendeeRepository;

    public AttendeeResource(AttendeeRepository attendeeRepository) {
        this.attendeeRepository = attendeeRepository;
    }

    /**
     * {@code POST  /attendees} : Create a new attendee.
     *
     * @param attendee the attendee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new attendee, or with status {@code 400 (Bad Request)} if the attendee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Attendee> createAttendee(@RequestBody Attendee attendee) throws URISyntaxException {
        log.debug("REST request to save Attendee : {}", attendee);
        if (attendee.getId() != null) {
            throw new BadRequestAlertException("A new attendee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        attendee = attendeeRepository.save(attendee);
        return ResponseEntity.created(new URI("/api/attendees/" + attendee.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, attendee.getId().toString()))
            .body(attendee);
    }

    /**
     * {@code PUT  /attendees/:id} : Updates an existing attendee.
     *
     * @param id the id of the attendee to save.
     * @param attendee the attendee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attendee,
     * or with status {@code 400 (Bad Request)} if the attendee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the attendee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Attendee> updateAttendee(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Attendee attendee
    ) throws URISyntaxException {
        log.debug("REST request to update Attendee : {}, {}", id, attendee);
        if (attendee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attendee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attendeeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        attendee = attendeeRepository.save(attendee);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attendee.getId().toString()))
            .body(attendee);
    }

    /**
     * {@code PATCH  /attendees/:id} : Partial updates given fields of an existing attendee, field will ignore if it is null
     *
     * @param id the id of the attendee to save.
     * @param attendee the attendee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attendee,
     * or with status {@code 400 (Bad Request)} if the attendee is not valid,
     * or with status {@code 404 (Not Found)} if the attendee is not found,
     * or with status {@code 500 (Internal Server Error)} if the attendee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Attendee> partialUpdateAttendee(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Attendee attendee
    ) throws URISyntaxException {
        log.debug("REST request to partial update Attendee partially : {}, {}", id, attendee);
        if (attendee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attendee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attendeeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Attendee> result = attendeeRepository
            .findById(attendee.getId())
            .map(existingAttendee -> {
                if (attendee.getFirstName() != null) {
                    existingAttendee.setFirstName(attendee.getFirstName());
                }
                if (attendee.getLastName() != null) {
                    existingAttendee.setLastName(attendee.getLastName());
                }
                if (attendee.getEmail() != null) {
                    existingAttendee.setEmail(attendee.getEmail());
                }
                if (attendee.getTelephone() != null) {
                    existingAttendee.setTelephone(attendee.getTelephone());
                }

                return existingAttendee;
            })
            .map(attendeeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attendee.getId().toString())
        );
    }

    /**
     * {@code GET  /attendees} : get all the attendees.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of attendees in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Attendee>> getAllAttendees(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Attendees");
        Page<Attendee> page;
        if (eagerload) {
            page = attendeeRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = attendeeRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /attendees/:id} : get the "id" attendee.
     *
     * @param id the id of the attendee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the attendee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Attendee> getAttendee(@PathVariable("id") Long id) {
        log.debug("REST request to get Attendee : {}", id);
        Optional<Attendee> attendee = attendeeRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(attendee);
    }

    /**
     * {@code DELETE  /attendees/:id} : delete the "id" attendee.
     *
     * @param id the id of the attendee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendee(@PathVariable("id") Long id) {
        log.debug("REST request to delete Attendee : {}", id);
        attendeeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
