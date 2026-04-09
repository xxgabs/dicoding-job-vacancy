<?php

// Feature: job-vacancy-system, Property 11: Delete removes vacancy

namespace Tests\Feature\Property;

use App\Models\Vacancy;
use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 6.1
 */
class DeleteVacancyPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 11 (Optional): Delete removes vacancy.
     *
     * For any existing vacancy, sending DELETE to /api/vacancies/{id} must
     * return HTTP 204, and a subsequent GET to /api/vacancies/{id} must
     * return HTTP 404.
     *
     * Validates: Requirements 6.1
     */
    public function test_delete_removes_vacancy(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        $this->forAll(
            $nonEmptyStringGen, // title
            $nonEmptyStringGen  // company
        )
        ->withMaxSize(100)
        ->then(function (string $title, string $company) {
            $vacancy = Vacancy::create([
                'title'       => $title,
                'description' => 'Some description',
                'company'     => $company,
                'location'    => 'Bandung',
            ]);

            $id = $vacancy->id;

            // DELETE should return 204
            $this->deleteJson("/api/vacancies/{$id}")
                ->assertStatus(204);

            // Subsequent GET should return 404
            $this->getJson("/api/vacancies/{$id}")
                ->assertStatus(404);
        });
    }
}
