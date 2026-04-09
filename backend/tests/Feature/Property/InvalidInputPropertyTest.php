<?php

// Feature: job-vacancy-system, Property 2: Invalid input is rejected with 422

namespace Tests\Feature\Property;

use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 1.2, 1.3
 */
class InvalidInputPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 2a: Missing required fields are rejected with 422.
     *
     * For any POST payload that is missing at least one required field
     * (title, description, company, or location), the API must return HTTP 422.
     *
     * Validates: Requirements 1.2
     */
    public function test_missing_required_fields_returns_422(): void
    {
        $requiredFields = ['title', 'description', 'company', 'location'];

        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Generate an index to determine which field to omit (0–3)
        $fieldIndexGen = Generators::choose(0, count($requiredFields) - 1);

        $this->forAll(
            $nonEmptyStringGen, // title
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (string $title, string $description, string $company, string $location) use ($requiredFields) {
            $fullPayload = [
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ];

            // Omit each required field in turn and assert 422 for each
            foreach ($requiredFields as $field) {
                $payload = $fullPayload;
                unset($payload[$field]);

                $response = $this->postJson('/api/vacancies', $payload);

                $response->assertStatus(422);
            }
        });
    }

    /**
     * Property 2b: Title exceeding 255 characters is rejected with 422.
     *
     * For any POST payload whose title length is > 255 chars, the API must
     * return HTTP 422 with a validation error body.
     *
     * Validates: Requirements 1.3
     */
    public function test_title_too_long_returns_422(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Generate a title that is guaranteed to exceed 255 characters
        $longTitleGen = Generators::map(
            fn (string $name) => str_repeat($name . '_', 30), // ~30*(len+1) chars, always > 255
            Generators::names()
        );

        $this->forAll(
            $longTitleGen,      // title > 255 chars
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (string $title, string $description, string $company, string $location) {
            // Ensure the generated title is actually > 255 chars
            if (strlen($title) <= 255) {
                $title = str_repeat('a', 256);
            }

            $payload = [
                'title'       => $title,
                'description' => $description,
                'company'     => $company,
                'location'    => $location,
            ];

            $response = $this->postJson('/api/vacancies', $payload);

            $response->assertStatus(422);
        });
    }
}
