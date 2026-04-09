<?php

// Feature: job-vacancy-system, Property 8: Serialization round-trip (POST → GET)

namespace Tests\Feature\Property;

use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 4.1, 10.1, 10.2
 */
class SerializationRoundTripPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 8: Serialization round-trip (POST → GET).
     *
     * For any valid vacancy payload, creating it via POST and then fetching
     * the created vacancy by its returned `id` via GET must produce a response
     * whose `title`, `description`, `company`, `location`, and `salary_range`
     * fields are equal to the originally submitted values.
     *
     * Validates: Requirements 4.1, 10.1, 10.2
     */
    public function test_serialization_round_trip_post_then_get(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // salary_range is optional (nullable); generate either null or a non-empty string
        $salaryRangeGen = Generators::oneOf(
            Generators::constant(null),
            Generators::map(
                fn (string $name) => 'x' . $name . ' IDR',
                Generators::names()
            )
        );

        $this->forAll(
            $nonEmptyStringGen, // title
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen, // location
            $salaryRangeGen     // salary_range
        )
        ->withMaxSize(100)
        ->then(function (
            string $title,
            string $description,
            string $company,
            string $location,
            ?string $salaryRange
        ) {
            $payload = [
                'title'        => $title,
                'description'  => $description,
                'company'      => $company,
                'location'     => $location,
                'salary_range' => $salaryRange,
            ];

            // POST to create the vacancy
            $postResponse = $this->postJson('/api/vacancies', $payload);
            $postResponse->assertStatus(201);

            $id = $postResponse->json('id');
            $this->assertNotNull($id, 'POST response must include an id');

            // GET the created vacancy by its returned ID
            $getResponse = $this->getJson('/api/vacancies/' . $id);
            $getResponse->assertStatus(200);

            // Assert all fields match the original payload
            $getResponse->assertJsonFragment([
                'title'        => $title,
                'description'  => $description,
                'company'      => $company,
                'location'     => $location,
                'salary_range' => $salaryRange,
            ]);
        });
    }
}
