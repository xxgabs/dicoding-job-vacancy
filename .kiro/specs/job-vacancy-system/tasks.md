# Implementation Plan: Job Vacancy System

## Overview

Implement a two-tier job vacancy system: a Laravel (PHP) RESTful API backend and a Next.js (TypeScript) frontend. Tasks are ordered so the backend is built and tested first, then the frontend consumes it.

## Tasks

- [x] 1. Set up Laravel backend project structure
  - Create the Laravel project (or confirm it exists) with the `vacancies` migration, `Vacancy` Eloquent model, and `VacancyController` stub
  - Define `$fillable` fields: `title`, `description`, `company`, `location`, `salary_range`
  - Register API routes in `routes/api.php` for POST, GET (list), GET (show), PUT/PATCH, DELETE on `/api/vacancies`
  - Configure the exception handler to return JSON 404 for `ModelNotFoundException` on API routes
  - _Requirements: 1.1, 1.4, 2.1, 4.1_

- [x] 2. Implement vacancy creation endpoint
  - [x] 2.1 Create `StoreVacancyRequest` with validation rules (required: title ≤ 255, description, company, location; optional: salary_range) and implement `VacancyController@store` returning 201 + created resource
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Write property test for valid create stores and returns submitted fields
    - **Property 1: Valid create stores and returns submitted fields**
    - **Validates: Requirements 1.1**
    - Use Eris to generate random valid payloads; assert HTTP 201 and matching response fields

  - [x] 2.3 Write property test for invalid input rejection
    - **Property 2: Invalid input is rejected with 422**
    - **Validates: Requirements 1.2, 1.3**
    - Use Eris to generate payloads with missing required fields or title > 255 chars; assert HTTP 422

  - [x] 2.4 Write property test for unique IDs
    - **Property 3: All created vacancy IDs are unique**
    - **Validates: Requirements 1.4**
    - Use Eris to create N vacancies and assert all returned IDs are distinct

  - [x] 2.5 Write integration tests for create vacancy endpoint (`tests/Feature/CreateVacancyTest`)
    - POST valid data → 201 + correct body
    - POST missing required fields → 422 with field errors
    - POST title > 255 chars → 422
    - _Requirements: 1.1, 1.2, 1.3, 8.1_

- [x] 3. Implement list and search vacancies endpoint
  - [x] 3.1 Implement `VacancyController@index` returning all vacancies as a JSON array (HTTP 200); add `scopeByTitle` on the `Vacancy` model for case-insensitive `LIKE` filtering when `?title=` is present
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.2 Write property test for list endpoint completeness
    - **Property 4: List endpoint returns all stored vacancies**
    - **Validates: Requirements 2.1, 2.2**
    - Use Eris to seed N vacancies and assert the list response length equals N

  - [x] 3.3 Write property test for search filter correctness
    - **Property 6: Search filter correctness**
    - **Validates: Requirements 3.1, 3.2**
    - Use Eris to generate random search terms and vacancy sets; assert only matching titles are returned

  - [x] 3.4 Write integration tests for list and search endpoints (`tests/Feature/ListVacanciesTest`, `tests/Feature/SearchVacanciesTest`)
    - Seed N vacancies → GET returns N items
    - Empty DB → empty array
    - GET with `?title=` → only matching vacancies returned
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 8.2, 8.4_

- [x] 4. Implement vacancy detail endpoint
  - [x] 4.1 Implement `VacancyController@show` using `findOrFail` to return the vacancy (HTTP 200) or 404 if not found
    - _Requirements: 4.1, 4.2_

  - [x] 4.2 Write property test for serialization round-trip
    - **Property 8: Serialization round-trip (POST → GET)**
    - **Validates: Requirements 4.1, 10.1, 10.2**
    - Use Eris to POST a valid payload then GET by returned ID; assert all fields match

  - [x] 4.3 Write property test for non-existent ID returns 404
    - **Property 9: Non-existent Vacancy_ID returns 404**
    - **Validates: Requirements 4.2**
    - Use Eris to generate random IDs not in the DB; assert GET returns 404

  - [x] 4.4 Write integration tests for vacancy detail endpoint (`tests/Feature/VacancyDetailTest`)
    - GET existing ID → 200 + correct body
    - GET non-existent ID → 404
    - _Requirements: 4.1, 4.2, 8.3_

- [x] 5. Implement backend unit tests
  - [x] 5.1 Write `tests/Unit/VacancyModelTest`: verify `$fillable` fields, attribute casting, and `scopeByTitle` filter logic
    - _Requirements: 7.1_

  - [x] 5.2 Write `tests/Unit/StoreVacancyRequestTest`: verify validation rules accept valid payloads and reject invalid ones (missing fields, title > 255)
    - _Requirements: 7.2_

- [x] 6. Checkpoint — backend tests passing
  - Ensure all backend unit and integration tests pass (`php artisan test`). Ask the user if any questions arise.

- [-] 7. Implement optional update and delete endpoints
  - [x] 7.1 Create `UpdateVacancyRequest` (all fields optional, same rules as store) and implement `VacancyController@update` returning 200 + updated resource, or 404/422 as appropriate
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 7.2 Write property test for update round-trip
    - **Property 10 (Optional): Update round-trip**
    - **Validates: Requirements 5.1**
    - Use Eris to generate valid update payloads; assert HTTP 200 and updated fields match

  - [x] 7.3 Write integration tests for update endpoint (`tests/Feature/UpdateVacancyTest`)
    - PUT valid → 200; PUT non-existent → 404; PUT invalid → 422
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 7.4 Implement `VacancyController@destroy` returning 204 on success or 404 if not found
    - _Requirements: 6.1, 6.2_

  - [x] 7.5 Write property test for delete removes vacancy
    - **Property 11 (Optional): Delete removes vacancy**
    - **Validates: Requirements 6.1**
    - Use Eris to DELETE an existing vacancy then GET it; assert 204 then 404

  - [x] 7.6 Write integration tests for delete endpoint (`tests/Feature/DeleteVacancyTest`)
    - DELETE existing → 204; DELETE non-existent → 404
    - _Requirements: 6.1, 6.2_

- [x] 8. Set up Next.js frontend project structure
  - Create the Next.js (TypeScript) project (or confirm it exists) with the `Vacancy` and `CreateVacancyPayload` TypeScript interfaces
  - Create `lib/api.ts` with `getVacancies(title?)`, `getVacancy(id)`, and `createVacancy(data)` functions
  - Install and configure TanStack Query (`QueryClientProvider` in `_app.tsx` or `layout.tsx`)
  - _Requirements: 2.3, 3.3, 4.3_

- [x] 9. Implement vacancies list page and components
  - [x] 9.1 Create the `JobCard` component accepting a `Vacancy` prop and rendering title, company, and location; create the `SearchInput` controlled component that updates a query state
    - _Requirements: 2.3, 3.3_

  - [x] 9.2 Create `VacanciesPage` (`/vacancies`) that uses `useVacancies(title?)` TanStack Query hook to fetch and render a `JobCard` per vacancy; wire `SearchInput` to the `title` query parameter so filtering happens without a full page reload
    - _Requirements: 2.3, 3.3, 3.4_

  - [x] 9.3 Write component tests for `JobCard` and `SearchInput` (Jest + React Testing Library)
    - `JobCard`: renders title, company, location from props
    - `SearchInput`: onChange updates query state
    - _Requirements: 7.1 (frontend analogue)_

  - [x] 9.4 Write property test for frontend renders one JobCard per vacancy
    - **Property 5: Frontend renders one JobCard per vacancy**
    - **Validates: Requirements 2.3**
    - Mock `useVacancies` with N vacancies; assert exactly N `JobCard` elements in the DOM

  - [x] 9.5 Write property test for frontend search input filters displayed JobCards
    - **Property 7: Frontend search input filters displayed JobCards**
    - **Validates: Requirements 3.3**
    - Mock hook with filtered data; assert only matching cards are visible

- [x] 10. Implement vacancy detail page
  - [x] 10.1 Create `VacancyDetailPage` (`/vacancies/[id]`) that uses `useVacancy(id)` to fetch and display all vacancy fields; call `notFound()` when the API returns 404
    - _Requirements: 4.3_

  - [x] 10.2 Write component test for `VacancyDetailPage`
    - Mocked `useVacancy` → all fields rendered correctly
    - Mocked 404 → `notFound()` called
    - _Requirements: 4.3_

- [x] 11. Checkpoint — frontend component tests passing
  - Ensure all frontend component and unit tests pass (`jest --run` or equivalent). Ask the user if any questions arise.

- [x] 12. Implement Playwright end-to-end tests
  - [x] 12.1 Write E2E test: open vacancies list page and verify at least one `JobCard` is visible
    - Tag comment: `// Requirement 9.1`
    - _Requirements: 9.1_

  - [x] 12.2 Write E2E test: type a search term into the search input and verify only matching `JobCard`s are displayed
    - Tag comment: `// Requirement 9.2 / Property 7`
    - _Requirements: 9.2_

  - [x] 12.3 Write E2E test: click a vacancy and verify the detail page displays the correct vacancy information
    - Tag comment: `// Requirement 9.3 / Property 8`
    - _Requirements: 9.3_

- [-] 13. Final checkpoint — all tests passing
  - Ensure all backend tests (`php artisan test`), frontend tests, and Playwright E2E tests pass. Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Backend property-based tests use [Eris](https://github.com/giorgiosironi/eris) with `->withMaxSize(100)` for sufficient input variety
- Backend tests use an in-memory SQLite database (`:memory:`) via the `RefreshDatabase` trait
- Playwright E2E tests require `NEXT_PUBLIC_API_URL` pointing to a running Laravel dev server
- Each task references specific requirements for traceability
