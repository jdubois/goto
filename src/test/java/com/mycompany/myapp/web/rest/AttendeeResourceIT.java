package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AttendeeAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Attendee;
import com.mycompany.myapp.repository.AttendeeRepository;
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
 * Integration tests for the {@link AttendeeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AttendeeResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/attendees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Mock
    private AttendeeRepository attendeeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttendeeMockMvc;

    private Attendee attendee;

    private Attendee insertedAttendee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attendee createEntity(EntityManager em) {
        Attendee attendee = new Attendee()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .telephone(DEFAULT_TELEPHONE);
        return attendee;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attendee createUpdatedEntity(EntityManager em) {
        Attendee attendee = new Attendee()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .telephone(UPDATED_TELEPHONE);
        return attendee;
    }

    @BeforeEach
    public void initTest() {
        attendee = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAttendee != null) {
            attendeeRepository.delete(insertedAttendee);
            insertedAttendee = null;
        }
    }

    @Test
    @Transactional
    void createAttendee() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Attendee
        var returnedAttendee = om.readValue(
            restAttendeeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attendee)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Attendee.class
        );

        // Validate the Attendee in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAttendeeUpdatableFieldsEquals(returnedAttendee, getPersistedAttendee(returnedAttendee));

        insertedAttendee = returnedAttendee;
    }

    @Test
    @Transactional
    void createAttendeeWithExistingId() throws Exception {
        // Create the Attendee with an existing ID
        attendee.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttendeeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attendee)))
            .andExpect(status().isBadRequest());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttendees() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        // Get all the attendeeList
        restAttendeeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attendee.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttendeesWithEagerRelationshipsIsEnabled() throws Exception {
        when(attendeeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttendeeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(attendeeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttendeesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(attendeeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttendeeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(attendeeRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAttendee() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        // Get the attendee
        restAttendeeMockMvc
            .perform(get(ENTITY_API_URL_ID, attendee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attendee.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE));
    }

    @Test
    @Transactional
    void getNonExistingAttendee() throws Exception {
        // Get the attendee
        restAttendeeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAttendee() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attendee
        Attendee updatedAttendee = attendeeRepository.findById(attendee.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAttendee are not directly saved in db
        em.detach(updatedAttendee);
        updatedAttendee.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).email(UPDATED_EMAIL).telephone(UPDATED_TELEPHONE);

        restAttendeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAttendee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAttendee))
            )
            .andExpect(status().isOk());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAttendeeToMatchAllProperties(updatedAttendee);
    }

    @Test
    @Transactional
    void putNonExistingAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attendee.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attendee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(attendee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attendee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttendeeWithPatch() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attendee using partial update
        Attendee partialUpdatedAttendee = new Attendee();
        partialUpdatedAttendee.setId(attendee.getId());

        partialUpdatedAttendee.email(UPDATED_EMAIL);

        restAttendeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttendee.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttendee))
            )
            .andExpect(status().isOk());

        // Validate the Attendee in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttendeeUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAttendee, attendee), getPersistedAttendee(attendee));
    }

    @Test
    @Transactional
    void fullUpdateAttendeeWithPatch() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attendee using partial update
        Attendee partialUpdatedAttendee = new Attendee();
        partialUpdatedAttendee.setId(attendee.getId());

        partialUpdatedAttendee.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).email(UPDATED_EMAIL).telephone(UPDATED_TELEPHONE);

        restAttendeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttendee.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttendee))
            )
            .andExpect(status().isOk());

        // Validate the Attendee in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttendeeUpdatableFieldsEquals(partialUpdatedAttendee, getPersistedAttendee(partialUpdatedAttendee));
    }

    @Test
    @Transactional
    void patchNonExistingAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attendee.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attendee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attendee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttendee() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attendee.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttendeeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(attendee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attendee in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttendee() throws Exception {
        // Initialize the database
        insertedAttendee = attendeeRepository.saveAndFlush(attendee);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the attendee
        restAttendeeMockMvc
            .perform(delete(ENTITY_API_URL_ID, attendee.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return attendeeRepository.count();
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

    protected Attendee getPersistedAttendee(Attendee attendee) {
        return attendeeRepository.findById(attendee.getId()).orElseThrow();
    }

    protected void assertPersistedAttendeeToMatchAllProperties(Attendee expectedAttendee) {
        assertAttendeeAllPropertiesEquals(expectedAttendee, getPersistedAttendee(expectedAttendee));
    }

    protected void assertPersistedAttendeeToMatchUpdatableProperties(Attendee expectedAttendee) {
        assertAttendeeAllUpdatablePropertiesEquals(expectedAttendee, getPersistedAttendee(expectedAttendee));
    }
}
