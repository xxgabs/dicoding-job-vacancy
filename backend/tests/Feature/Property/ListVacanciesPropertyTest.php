<?php

// Feature: job-vacancy-system, Property 4: List endpoint returns all stored vacancies

namespace Tests\Feature\Property;

use App\Models\Vacancy;
use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 2.1, 2.2
 */
class ListVacanciesPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 4: List endpoint returns all stored vacancies.
     *
     * For any set of vacancies in the database (including the empty set),
     * a GET to /api/vacancies must return HTTP 200 and a JSON array whose
     * length equals the number of stored vacancies.
     *
     * Validates: Requirements 2.1, 2.2
     */
    public function test_list_endpoint_returns_all_stored_vacancies(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Generate N between 0 and 10
        $countGen = Generators::choose(0, 10);

        $this->forAll(
            $countGen,
            $nonEmptyStringGen, // title
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (int $n, string $title, string $description, string $company, string $location) {
            // Clear vacancies between iterations to ensure a clean slate
            Vacancy::query()->delete();

            // POST N vacancies
            for ($i = 0; $i < $n; $i++) {
                $payload = [
                    'title'       => $title . '_' . $i,
                    'description' => $description,
                    'company'     => $company,
                    'location'    => $location,
                ];

                $this->postJson('/api/vacancies', $payload)->assertStatus(201);
            }

            // GET /api/vacancies and assert the array length equals N
            $response = $this->getJson('/api/vacancies');

            $response->assertStatus(200);
            $this->assertCount($n, $response->json(), "List response length must equal the number of stored vacancies ({$n})");
        });
    }

    /**
     * Empty case: when no vacancies exist, the list endpoint returns an empty array.
     *
     * Validates: Requirements 2.1, 2.2
     */
    public function test_list_endpoint_returns_empty_array_when_no_vacancies(): void
    {
        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200);
        $response->assertExactJson([]);
    }
}
