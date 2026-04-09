<?php

// Feature: job-vacancy-system, Property 10: Update round-trip

namespace Tests\Feature\Property;

use App\Models\Vacancy;
use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 5.1
 */
class UpdateRoundTripPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 10 (Optional): Update round-trip.
     *
     * For any existing vacancy and any valid update payload, sending PUT to
     * /api/vacancies/{id} must return HTTP 200 and a response body whose
     * updated fields match the submitted values.
     *
     * Validates: Requirements 5.1
     */
    public function test_update_round_trip(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        $this->forAll(
            $nonEmptyStringGen, // new title
            $nonEmptyStringGen, // new description
            $nonEmptyStringGen, // new company
            $nonEmptyStringGen  // new location
        )
        ->withMaxSize(100)
        ->then(function (
            string $title,
            string $description,
            string $company,
            string $location
        ) {
            // Create a vacancy in the DB to update
            $vacancy = Vacancy::create([
                'title'       => 'Original Title',
                'description' => 'Original description',
                'company'     => 'Original Company',
                'location'    => 'Original Location',
            ]);

            $payload = [
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ];

            // PUT to update the vacancy
            $response = $this->putJson('/api/vacancies/' . $vacancy->id, $payload);
            $response->assertStatus(200);

            // Assert the response body contains the updated field values
            $response->assertJsonFragment([
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ]);
        });
    }
}
