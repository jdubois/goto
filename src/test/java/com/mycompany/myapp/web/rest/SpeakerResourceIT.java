package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.SpeakerAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Speaker;
import com.mycompany.myapp.repository.SpeakerRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SpeakerResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SpeakerResourceIT {

    private static final String DEFAULT_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FULL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/speakers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SpeakerRepository speakerRepository;

    @Mock
    private SpeakerRepository speakerRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSpeakerMockMvc;

    private Speaker speaker;

    private Speaker insertedSpeaker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Speaker createEntity(EntityManager em) {
        Speaker speaker = new Speaker().fullName(DEFAULT_FULL_NAME).email(DEFAULT_EMAIL).company(DEFAULT_COMPANY);
        return speaker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Speaker createUpdatedEntity(EntityManager em) {
        Speaker speaker = new Speaker().fullName(UPDATED_FULL_NAME).email(UPDATED_EMAIL).company(UPDATED_COMPANY);
        return speaker;
    }

    @BeforeEach
    public void initTest() {
        speaker = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedSpeaker != null) {
            speakerRepository.delete(insertedSpeaker);
            insertedSpeaker = null;
        }
    }

    @Test
    @Transactional
    void createSpeaker() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Speaker
        var returnedSpeaker = om.readValue(
            restSpeakerMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(speaker)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Speaker.class
        );

        // Validate the Speaker in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSpeakerUpdatableFieldsEquals(returnedSpeaker, getPersistedSpeaker(returnedSpeaker));

        insertedSpeaker = returnedSpeaker;
    }

    @Test
    @Transactional
    void createSpeakerWithExistingId() throws Exception {
        // Create the Speaker with an existing ID
        speaker.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpeakerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(speaker)))
            .andExpect(status().isBadRequest());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSpeakers() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        // Get all the speakerList
        restSpeakerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(speaker.getId().intValue())))
            .andExpect(jsonPath("$.[*].fullName").value(hasItem(DEFAULT_FULL_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSpeakersWithEagerRelationshipsIsEnabled() throws Exception {
        when(speakerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSpeakerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(speakerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSpeakersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(speakerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSpeakerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(speakerRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSpeaker() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        // Get the speaker
        restSpeakerMockMvc
            .perform(get(ENTITY_API_URL_ID, speaker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(speaker.getId().intValue()))
            .andExpect(jsonPath("$.fullName").value(DEFAULT_FULL_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY));
    }

    @Test
    @Transactional
    void getNonExistingSpeaker() throws Exception {
        // Get the speaker
        restSpeakerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSpeaker() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the speaker
        Speaker updatedSpeaker = speakerRepository.findById(speaker.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSpeaker are not directly saved in db
        em.detach(updatedSpeaker);
        updatedSpeaker.fullName(UPDATED_FULL_NAME).email(UPDATED_EMAIL).company(UPDATED_COMPANY);

        restSpeakerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSpeaker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSpeaker))
            )
            .andExpect(status().isOk());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSpeakerToMatchAllProperties(updatedSpeaker);
    }

    @Test
    @Transactional
    void putNonExistingSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(put(ENTITY_API_URL_ID, speaker.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(speaker)))
            .andExpect(status().isBadRequest());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(speaker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(speaker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSpeakerWithPatch() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the speaker using partial update
        Speaker partialUpdatedSpeaker = new Speaker();
        partialUpdatedSpeaker.setId(speaker.getId());

        partialUpdatedSpeaker.fullName(UPDATED_FULL_NAME);

        restSpeakerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpeaker.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSpeaker))
            )
            .andExpect(status().isOk());

        // Validate the Speaker in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSpeakerUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSpeaker, speaker), getPersistedSpeaker(speaker));
    }

    @Test
    @Transactional
    void fullUpdateSpeakerWithPatch() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the speaker using partial update
        Speaker partialUpdatedSpeaker = new Speaker();
        partialUpdatedSpeaker.setId(speaker.getId());

        partialUpdatedSpeaker.fullName(UPDATED_FULL_NAME).email(UPDATED_EMAIL).company(UPDATED_COMPANY);

        restSpeakerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpeaker.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSpeaker))
            )
            .andExpect(status().isOk());

        // Validate the Speaker in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSpeakerUpdatableFieldsEquals(partialUpdatedSpeaker, getPersistedSpeaker(partialUpdatedSpeaker));
    }

    @Test
    @Transactional
    void patchNonExistingSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, speaker.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(speaker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(speaker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSpeaker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        speaker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpeakerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(speaker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Speaker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSpeaker() throws Exception {
        // Initialize the database
        insertedSpeaker = speakerRepository.saveAndFlush(speaker);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the speaker
        restSpeakerMockMvc
            .perform(delete(ENTITY_API_URL_ID, speaker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return speakerRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Speaker getPersistedSpeaker(Speaker speaker) {
        return speakerRepository.findById(speaker.getId()).orElseThrow();
    }

    protected void assertPersistedSpeakerToMatchAllProperties(Speaker expectedSpeaker) {
        assertSpeakerAllPropertiesEquals(expectedSpeaker, getPersistedSpeaker(expectedSpeaker));
    }

    protected void assertPersistedSpeakerToMatchUpdatableProperties(Speaker expectedSpeaker) {
        assertSpeakerAllUpdatablePropertiesEquals(expectedSpeaker, getPersistedSpeaker(expectedSpeaker));
    }
}
