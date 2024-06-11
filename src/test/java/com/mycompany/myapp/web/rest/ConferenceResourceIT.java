package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ConferenceAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Conference;
import com.mycompany.myapp.repository.ConferenceRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ConferenceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConferenceResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_PALCE = "AAAAAAAAAA";
    private static final String UPDATED_PALCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/conferences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConferenceMockMvc;

    private Conference conference;

    private Conference insertedConference;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conference createEntity(EntityManager em) {
        Conference conference = new Conference()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .palce(DEFAULT_PALCE);
        return conference;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conference createUpdatedEntity(EntityManager em) {
        Conference conference = new Conference()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .palce(UPDATED_PALCE);
        return conference;
    }

    @BeforeEach
    public void initTest() {
        conference = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedConference != null) {
            conferenceRepository.delete(insertedConference);
            insertedConference = null;
        }
    }

    @Test
    @Transactional
    void createConference() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Conference
        var returnedConference = om.readValue(
            restConferenceMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conference)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Conference.class
        );

        // Validate the Conference in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertConferenceUpdatableFieldsEquals(returnedConference, getPersistedConference(returnedConference));

        insertedConference = returnedConference;
    }

    @Test
    @Transactional
    void createConferenceWithExistingId() throws Exception {
        // Create the Conference with an existing ID
        conference.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConferenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conference)))
            .andExpect(status().isBadRequest());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        conference.setTitle(null);

        // Create the Conference, which fails.

        restConferenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conference)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllConferences() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        // Get all the conferenceList
        restConferenceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(conference.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].palce").value(hasItem(DEFAULT_PALCE)));
    }

    @Test
    @Transactional
    void getConference() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        // Get the conference
        restConferenceMockMvc
            .perform(get(ENTITY_API_URL_ID, conference.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(conference.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.palce").value(DEFAULT_PALCE));
    }

    @Test
    @Transactional
    void getNonExistingConference() throws Exception {
        // Get the conference
        restConferenceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConference() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conference
        Conference updatedConference = conferenceRepository.findById(conference.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedConference are not directly saved in db
        em.detach(updatedConference);
        updatedConference.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).palce(UPDATED_PALCE);

        restConferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConference.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedConference))
            )
            .andExpect(status().isOk());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedConferenceToMatchAllProperties(updatedConference);
    }

    @Test
    @Transactional
    void putNonExistingConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, conference.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conference))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(conference))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conference)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConferenceWithPatch() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conference using partial update
        Conference partialUpdatedConference = new Conference();
        partialUpdatedConference.setId(conference.getId());

        partialUpdatedConference.title(UPDATED_TITLE).date(UPDATED_DATE).palce(UPDATED_PALCE);

        restConferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConference))
            )
            .andExpect(status().isOk());

        // Validate the Conference in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConferenceUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedConference, conference),
            getPersistedConference(conference)
        );
    }

    @Test
    @Transactional
    void fullUpdateConferenceWithPatch() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conference using partial update
        Conference partialUpdatedConference = new Conference();
        partialUpdatedConference.setId(conference.getId());

        partialUpdatedConference.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).palce(UPDATED_PALCE);

        restConferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConference))
            )
            .andExpect(status().isOk());

        // Validate the Conference in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConferenceUpdatableFieldsEquals(partialUpdatedConference, getPersistedConference(partialUpdatedConference));
    }

    @Test
    @Transactional
    void patchNonExistingConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, conference.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(conference))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(conference))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConference() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conference.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConferenceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(conference)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conference in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConference() throws Exception {
        // Initialize the database
        insertedConference = conferenceRepository.saveAndFlush(conference);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the conference
        restConferenceMockMvc
            .perform(delete(ENTITY_API_URL_ID, conference.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return conferenceRepository.count();
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

    protected Conference getPersistedConference(Conference conference) {
        return conferenceRepository.findById(conference.getId()).orElseThrow();
    }

    protected void assertPersistedConferenceToMatchAllProperties(Conference expectedConference) {
        assertConferenceAllPropertiesEquals(expectedConference, getPersistedConference(expectedConference));
    }

    protected void assertPersistedConferenceToMatchUpdatableProperties(Conference expectedConference) {
        assertConferenceAllUpdatablePropertiesEquals(expectedConference, getPersistedConference(expectedConference));
    }
}
