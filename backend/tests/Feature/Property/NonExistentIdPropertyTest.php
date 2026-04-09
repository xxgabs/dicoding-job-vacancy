<?php

// Feature: job-vacancy-system, Property 9: Non-existent Vacancy_ID returns 404

namespace Tests\Feature\Property;

use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 4.2
 */
class NonExistentIdPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 9: Non-existent Vacancy_ID returns 404.
     *
     * For any integer ID that does not correspond to an existing vacancy,
     * GET /api/vacancies/{id} must return HTTP 404.
     *
     * Validates: Requirements 4.2
     */
    public function test_non_existent_vacancy_id_returns_404(): void
    {
        // Generate large random IDs (100000–999999) that won't exist in the empty test DB
        $idGen = Generators::choose(100000, 999999);

        $this->forAll($idGen)
            ->withMaxSize(100)
            ->then(function (int $id) {
                $response = $this->getJson("/api/vacancies/{$id}");

                $response->assertStatus(404);
            });
    }
}
