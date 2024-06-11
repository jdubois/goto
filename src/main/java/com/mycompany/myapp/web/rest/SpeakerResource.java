package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Speaker;
import com.mycompany.myapp.repository.SpeakerRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Speaker}.
 */
@RestController
@RequestMapping("/api/speakers")
@Transactional
public class SpeakerResource {

    private final Logger log = LoggerFactory.getLogger(SpeakerResource.class);

    private static final String ENTITY_NAME = "speaker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpeakerRepository speakerRepository;

    public SpeakerResource(SpeakerRepository speakerRepository) {
        this.speakerRepository = speakerRepository;
    }

    /**
     * {@code POST  /speakers} : Create a new speaker.
     *
     * @param speaker the speaker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new speaker, or with status {@code 400 (Bad Request)} if the speaker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Speaker> createSpeaker(@RequestBody Speaker speaker) throws URISyntaxException {
        log.debug("REST request to save Speaker : {}", speaker);
        if (speaker.getId() != null) {
            throw new BadRequestAlertException("A new speaker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        speaker = speakerRepository.save(speaker);
        return ResponseEntity.created(new URI("/api/speakers/" + speaker.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, speaker.getId().toString()))
            .body(speaker);
    }

    /**
     * {@code PUT  /speakers/:id} : Updates an existing speaker.
     *
     * @param id the id of the speaker to save.
     * @param speaker the speaker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated speaker,
     * or with status {@code 400 (Bad Request)} if the speaker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the speaker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Speaker> updateSpeaker(@PathVariable(value = "id", required = false) final Long id, @RequestBody Speaker speaker)
        throws URISyntaxException {
        log.debug("REST request to update Speaker : {}, {}", id, speaker);
        if (speaker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, speaker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!speakerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        speaker = speakerRepository.save(speaker);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, speaker.getId().toString()))
            .body(speaker);
    }

    /**
     * {@code PATCH  /speakers/:id} : Partial updates given fields of an existing speaker, field will ignore if it is null
     *
     * @param id the id of the speaker to save.
     * @param speaker the speaker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated speaker,
     * or with status {@code 400 (Bad Request)} if the speaker is not valid,
     * or with status {@code 404 (Not Found)} if the speaker is not found,
     * or with status {@code 500 (Internal Server Error)} if the speaker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Speaker> partialUpdateSpeaker(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Speaker speaker
    ) throws URISyntaxException {
        log.debug("REST request to partial update Speaker partially : {}, {}", id, speaker);
        if (speaker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, speaker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!speakerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Speaker> result = speakerRepository
            .findById(speaker.getId())
            .map(existingSpeaker -> {
                if (speaker.getFullName() != null) {
                    existingSpeaker.setFullName(speaker.getFullName());
                }
                if (speaker.getEmail() != null) {
                    existingSpeaker.setEmail(speaker.getEmail());
                }
                if (speaker.getCompany() != null) {
                    existingSpeaker.setCompany(speaker.getCompany());
                }

                return existingSpeaker;
            })
            .map(speakerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, speaker.getId().toString())
        );
    }

    /**
     * {@code GET  /speakers} : get all the speakers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of speakers in body.
     */
    @GetMapping("")
    public List<Speaker> getAllSpeakers(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Speakers");
        if (eagerload) {
            return speakerRepository.findAllWithEagerRelationships();
        } else {
            return speakerRepository.findAll();
        }
    }

    /**
     * {@code GET  /speakers/:id} : get the "id" speaker.
     *
     * @param id the id of the speaker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the speaker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Speaker> getSpeaker(@PathVariable("id") Long id) {
        log.debug("REST request to get Speaker : {}", id);
        Optional<Speaker> speaker = speakerRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(speaker);
    }

    /**
     * {@code DELETE  /speakers/:id} : delete the "id" speaker.
     *
     * @param id the id of the speaker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpeaker(@PathVariable("id") Long id) {
        log.debug("REST request to delete Speaker : {}", id);
        speakerRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
