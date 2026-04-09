# Requirements Document

## Introduction

A job vacancy system for the Dicoding Jobs platform, consisting of a Laravel (PHP) backend API and a Next.js frontend. Recruiters can create and manage job vacancies; job seekers can browse, search, and view vacancy details. The system exposes a RESTful API consumed by the frontend, with full test coverage on both layers.

## Glossary

- **System**: The job vacancy system as a whole (backend + frontend combined)
- **API**: The Laravel backend RESTful API
- **Frontend**: The Next.js web application
- **Vacancy**: A job posting containing title, description, company, location, and other relevant fields
- **Recruiter**: A user who creates and manages job vacancies
- **Job_Seeker**: A user who browses, searches, and views job vacancies
- **Vacancy_ID**: A unique identifier assigned to each vacancy upon creation
- **Job_Card**: A reusable UI component that displays a summary of a single vacancy

---

## Requirements

### Requirement 1: Create Vacancy

**User Story:** As a Recruiter, I want to create a new vacancy, so that my vacancy can be listed on the Dicoding Jobs platform.

#### Acceptance Criteria

1. WHEN a POST request is sent to the create vacancy endpoint with valid vacancy data, THE API SHALL store the vacancy in the database and return the created vacancy with HTTP 201.
2. IF a POST request is sent to the create vacancy endpoint with missing required fields, THEN THE API SHALL return a validation error response with HTTP 422 and a descriptive message for each invalid field.
3. IF a POST request is sent to the create vacancy endpoint with a title exceeding 255 characters, THEN THE API SHALL return a validation error response with HTTP 422.
4. THE API SHALL assign a unique Vacancy_ID to each newly created vacancy.

---

### Requirement 2: List Vacancies

**User Story:** As a Job_Seeker, I want to view all available vacancies, so that I can browse open positions.

#### Acceptance Criteria

1. WHEN a GET request is sent to the list vacancies endpoint, THE API SHALL return all available vacancies as a JSON array with HTTP 200.
2. WHEN the vacancies list is empty, THE API SHALL return an empty JSON array with HTTP 200.
3. THE Frontend SHALL fetch the vacancies list from the API on page load and render each vacancy using a Job_Card component.

---

### Requirement 3: Search Vacancies by Title

**User Story:** As a Job_Seeker, I want to search for jobs by title, so that I can find the job that I want.

#### Acceptance Criteria

1. WHEN a GET request is sent to the list vacancies endpoint with a title query parameter, THE API SHALL return only vacancies whose titles contain the search term (case-insensitive) with HTTP 200.
2. WHEN a search term matches no vacancies, THE API SHALL return an empty JSON array with HTTP 200.
3. WHEN a Job_Seeker types a search term in the search input on the Frontend, THE Frontend SHALL filter the displayed Job_Card list to show only vacancies whose titles contain the search term.
4. THE Frontend SHALL perform the title search without requiring a full page reload.

---

### Requirement 4: View Vacancy Detail

**User Story:** As a Job_Seeker, I want to view the details of a specific vacancy, so that I can learn more about the position before applying.

#### Acceptance Criteria

1. WHEN a GET request is sent to the vacancy detail endpoint with a valid Vacancy_ID, THE API SHALL return the full details of that vacancy with HTTP 200.
2. IF a GET request is sent to the vacancy detail endpoint with a Vacancy_ID that does not exist, THEN THE API SHALL return an error response with HTTP 404.
3. WHEN a Job_Seeker selects a vacancy on the Frontend, THE Frontend SHALL navigate to the vacancy detail page and display all vacancy fields fetched from the API.

---

### Requirement 5: Update Vacancy (Optional)

**User Story:** As a Recruiter, I want to update an existing vacancy, so that I can correct or improve the vacancy information.

#### Acceptance Criteria

1. WHERE the update vacancy feature is enabled, WHEN a PUT or PATCH request is sent to the update vacancy endpoint with a valid Vacancy_ID and valid data, THE API SHALL update the vacancy in the database and return the updated vacancy with HTTP 200.
2. WHERE the update vacancy feature is enabled, IF a PUT or PATCH request is sent with a Vacancy_ID that does not exist, THEN THE API SHALL return an error response with HTTP 404.
3. WHERE the update vacancy feature is enabled, IF a PUT or PATCH request is sent with invalid data, THEN THE API SHALL return a validation error response with HTTP 422.

---

### Requirement 6: Delete Vacancy (Optional)

**User Story:** As a Recruiter, I want to delete a vacancy, so that outdated or filled positions are removed from the platform.

#### Acceptance Criteria

1. WHERE the delete vacancy feature is enabled, WHEN a DELETE request is sent to the delete vacancy endpoint with a valid Vacancy_ID, THE API SHALL remove the vacancy from the database and return HTTP 204.
2. WHERE the delete vacancy feature is enabled, IF a DELETE request is sent with a Vacancy_ID that does not exist, THEN THE API SHALL return an error response with HTTP 404.

---

### Requirement 7: Backend Unit Tests

**User Story:** As a Developer, I want unit tests for the vacancy model and validation logic, so that I can verify core business rules in isolation.

#### Acceptance Criteria

1. THE Backend_Test_Suite SHALL include unit tests that verify vacancy model attribute assignment and fillable field behavior.
2. THE Backend_Test_Suite SHALL include unit tests that verify request validation rules accept valid input and reject invalid input.
3. WHEN all backend unit tests are executed, THE Backend_Test_Suite SHALL report all tests as passing.

---

### Requirement 8: Backend Integration Tests

**User Story:** As a Developer, I want integration tests for all API endpoints, so that I can verify the full request-response cycle including database interaction.

#### Acceptance Criteria

1. THE Backend_Test_Suite SHALL include integration tests for the create vacancy endpoint that verify HTTP status codes and response body structure.
2. THE Backend_Test_Suite SHALL include integration tests for the list vacancies endpoint that verify the response contains all stored vacancies.
3. THE Backend_Test_Suite SHALL include integration tests for the vacancy detail endpoint that verify correct data is returned for a valid Vacancy_ID and a 404 is returned for an invalid Vacancy_ID.
4. THE Backend_Test_Suite SHALL include integration tests for the title search that verify only matching vacancies are returned.
5. WHEN all backend integration tests are executed, THE Backend_Test_Suite SHALL report all tests as passing.

---

### Requirement 9: Frontend End-to-End Tests

**User Story:** As a Developer, I want end-to-end tests using Playwright, so that I can verify the critical user journeys work correctly in a real browser.

#### Acceptance Criteria

1. THE E2E_Test_Suite SHALL include a test that opens the vacancies list page and verifies at least one Job_Card is visible.
2. THE E2E_Test_Suite SHALL include a test that types a search term into the search input and verifies only matching Job_Cards are displayed.
3. THE E2E_Test_Suite SHALL include a test that selects a vacancy and verifies the vacancy detail page displays the correct vacancy information.
4. WHEN all end-to-end tests are executed against a running instance of the Frontend and API, THE E2E_Test_Suite SHALL report all tests as passing.

---

### Requirement 10: Data Serialization Round-Trip

**User Story:** As a Developer, I want vacancy data to serialize and deserialize consistently, so that data integrity is maintained across API boundaries.

#### Acceptance Criteria

1. THE API SHALL serialize vacancy records to JSON in a consistent, documented structure.
2. FOR ALL valid vacancy JSON payloads, sending the payload to the create endpoint then fetching the created vacancy SHALL produce a response containing equivalent field values (round-trip property).
