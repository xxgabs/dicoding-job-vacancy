<?php

// Feature: job-vacancy-system, Property 1: Valid create stores and returns submitted fields

namespace Tests\Feature\Property;

use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 1.1
 */
class CreateVacancyPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 1: Valid create stores and returns submitted fields.
     *
     * For any valid vacancy payload (non-empty title ≤ 255 chars, non-empty
     * description, company, and location), POSTing to /api/vacancies must
     * return HTTP 201 and a response body whose fields match the submitted values.
     *
     * Validates: Requirements 1.1
     */
    public function test_valid_create_stores_and_returns_submitted_fields(): void
    {
        // map names() to guarantee a non-empty string by prepending a constant
        // prefix, ensuring the value is always valid regardless of size.
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Title: same approach, and the prefix + name will always be ≤ 255 chars
        // since names() generates short first names.
        $titleGen = $nonEmptyStringGen;

        $this->forAll(
            $titleGen,       // title
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (string $title, string $description, string $company, string $location) {
            $payload = [
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ];

            $response = $this->postJson('/api/vacancies', $payload);

            $response->assertStatus(201);
            $response->assertJsonFragment([
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ]);
        });
    }
}
