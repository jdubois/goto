package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.SessionAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Session;
import com.mycompany.myapp.repository.SessionRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link SessionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SessionResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_ROOM = "AAAAAAAAAA";
    private static final String UPDATED_ROOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sessions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSessionMockMvc;

    private Session session;

    private Session insertedSession;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Session createEntity(EntityManager em) {
        Session session = new Session().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION).room(DEFAULT_ROOM);
        return session;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Session createUpdatedEntity(EntityManager em) {
        Session session = new Session().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).room(UPDATED_ROOM);
        return session;
    }

    @BeforeEach
    public void initTest() {
        session = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedSession != null) {
            sessionRepository.delete(insertedSession);
            insertedSession = null;
        }
    }

    @Test
    @Transactional
    void createSession() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Session
        var returnedSession = om.readValue(
            restSessionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(session)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Session.class
        );

        // Validate the Session in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSessionUpdatableFieldsEquals(returnedSession, getPersistedSession(returnedSession));

        insertedSession = returnedSession;
    }

    @Test
    @Transactional
    void createSessionWithExistingId() throws Exception {
        // Create the Session with an existing ID
        session.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(session)))
            .andExpect(status().isBadRequest());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        session.setTitle(null);

        // Create the Session, which fails.

        restSessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(session)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSessions() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        // Get all the sessionList
        restSessionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(session.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].room").value(hasItem(DEFAULT_ROOM)));
    }

    @Test
    @Transactional
    void getSession() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        // Get the session
        restSessionMockMvc
            .perform(get(ENTITY_API_URL_ID, session.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(session.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.room").value(DEFAULT_ROOM));
    }

    @Test
    @Transactional
    void getNonExistingSession() throws Exception {
        // Get the session
        restSessionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSession() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the session
        Session updatedSession = sessionRepository.findById(session.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSession are not directly saved in db
        em.detach(updatedSession);
        updatedSession.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).room(UPDATED_ROOM);

        restSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSession))
            )
            .andExpect(status().isOk());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSessionToMatchAllProperties(updatedSession);
    }

    @Test
    @Transactional
    void putNonExistingSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(put(ENTITY_API_URL_ID, session.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(session)))
            .andExpect(status().isBadRequest());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(session))
            )
            .andExpect(status().isBadRequest());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(session)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSessionWithPatch() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the session using partial update
        Session partialUpdatedSession = new Session();
        partialUpdatedSession.setId(session.getId());

        partialUpdatedSession.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).room(UPDATED_ROOM);

        restSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSession))
            )
            .andExpect(status().isOk());

        // Validate the Session in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSessionUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSession, session), getPersistedSession(session));
    }

    @Test
    @Transactional
    void fullUpdateSessionWithPatch() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the session using partial update
        Session partialUpdatedSession = new Session();
        partialUpdatedSession.setId(session.getId());

        partialUpdatedSession.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).room(UPDATED_ROOM);

        restSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSession))
            )
            .andExpect(status().isOk());

        // Validate the Session in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSessionUpdatableFieldsEquals(partialUpdatedSession, getPersistedSession(partialUpdatedSession));
    }

    @Test
    @Transactional
    void patchNonExistingSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, session.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(session))
            )
            .andExpect(status().isBadRequest());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(session))
            )
            .andExpect(status().isBadRequest());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        session.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(session)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Session in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSession() throws Exception {
        // Initialize the database
        insertedSession = sessionRepository.saveAndFlush(session);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the session
        restSessionMockMvc
            .perform(delete(ENTITY_API_URL_ID, session.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sessionRepository.count();
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

    protected Session getPersistedSession(Session session) {
        return sessionRepository.findById(session.getId()).orElseThrow();
    }

    protected void assertPersistedSessionToMatchAllProperties(Session expectedSession) {
        assertSessionAllPropertiesEquals(expectedSession, getPersistedSession(expectedSession));
    }

    protected void assertPersistedSessionToMatchUpdatableProperties(Session expectedSession) {
        assertSessionAllUpdatablePropertiesEquals(expectedSession, getPersistedSession(expectedSession));
    }
}
