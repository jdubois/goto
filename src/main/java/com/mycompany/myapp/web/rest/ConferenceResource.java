package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Conference;
import com.mycompany.myapp.repository.ConferenceRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Conference}.
 */
@RestController
@RequestMapping("/api/conferences")
@Transactional
public class ConferenceResource {

    private final Logger log = LoggerFactory.getLogger(ConferenceResource.class);

    private static final String ENTITY_NAME = "conference";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConferenceRepository conferenceRepository;

    public ConferenceResource(ConferenceRepository conferenceRepository) {
        this.conferenceRepository = conferenceRepository;
    }

    /**
     * {@code POST  /conferences} : Create a new conference.
     *
     * @param conference the conference to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new conference, or with status {@code 400 (Bad Request)} if the conference has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Conference> createConference(@Valid @RequestBody Conference conference) throws URISyntaxException {
        log.debug("REST request to save Conference : {}", conference);
        if (conference.getId() != null) {
            throw new BadRequestAlertException("A new conference cannot already have an ID", ENTITY_NAME, "idexists");
        }
        conference = conferenceRepository.save(conference);
        return ResponseEntity.created(new URI("/api/conferences/" + conference.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, conference.getId().toString()))
            .body(conference);
    }

    /**
     * {@code PUT  /conferences/:id} : Updates an existing conference.
     *
     * @param id the id of the conference to save.
     * @param conference the conference to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conference,
     * or with status {@code 400 (Bad Request)} if the conference is not valid,
     * or with status {@code 500 (Internal Server Error)} if the conference couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Conference> updateConference(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Conference conference
    ) throws URISyntaxException {
        log.debug("REST request to update Conference : {}, {}", id, conference);
        if (conference.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conference.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!conferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        conference = conferenceRepository.save(conference);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, conference.getId().toString()))
            .body(conference);
    }

    /**
     * {@code PATCH  /conferences/:id} : Partial updates given fields of an existing conference, field will ignore if it is null
     *
     * @param id the id of the conference to save.
     * @param conference the conference to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conference,
     * or with status {@code 400 (Bad Request)} if the conference is not valid,
     * or with status {@code 404 (Not Found)} if the conference is not found,
     * or with status {@code 500 (Internal Server Error)} if the conference couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Conference> partialUpdateConference(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Conference conference
    ) throws URISyntaxException {
        log.debug("REST request to partial update Conference partially : {}, {}", id, conference);
        if (conference.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conference.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!conferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Conference> result = conferenceRepository
            .findById(conference.getId())
            .map(existingConference -> {
                if (conference.getTitle() != null) {
                    existingConference.setTitle(conference.getTitle());
                }
                if (conference.getDescription() != null) {
                    existingConference.setDescription(conference.getDescription());
                }
                if (conference.getDate() != null) {
                    existingConference.setDate(conference.getDate());
                }
                if (conference.getPalce() != null) {
                    existingConference.setPalce(conference.getPalce());
                }

                return existingConference;
            })
            .map(conferenceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, conference.getId().toString())
        );
    }

    /**
     * {@code GET  /conferences} : get all the conferences.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of conferences in body.
     */
    @GetMapping("")
    public List<Conference> getAllConferences() {
        log.debug("REST request to get all Conferences");
        return conferenceRepository.findAll();
    }

    /**
     * {@code GET  /conferences/:id} : get the "id" conference.
     *
     * @param id the id of the conference to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the conference, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Conference> getConference(@PathVariable("id") Long id) {
        log.debug("REST request to get Conference : {}", id);
        Optional<Conference> conference = conferenceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(conference);
    }

    /**
     * {@code DELETE  /conferences/:id} : delete the "id" conference.
     *
     * @param id the id of the conference to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable("id") Long id) {
        log.debug("REST request to delete Conference : {}", id);
        conferenceRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
