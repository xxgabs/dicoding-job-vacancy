<?php

// Feature: job-vacancy-system, Property 3: All created vacancy IDs are unique

namespace Tests\Feature\Property;

use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 1.4
 */
class UniqueIdPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 3: All created vacancy IDs are unique.
     *
     * For any sequence of N successful create requests, the N returned `id`
     * values must all be distinct.
     *
     * Validates: Requirements 1.4
     */
    public function test_all_created_vacancy_ids_are_unique(): void
    {
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Generate N between 2 and 10
        $countGen = Generators::choose(2, 10);

        $this->forAll(
            $countGen,
            $nonEmptyStringGen, // title
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (int $n, string $title, string $description, string $company, string $location) {
            $ids = [];

            for ($i = 0; $i < $n; $i++) {
                $payload = [
                    'title'       => $title . '_' . $i,
                    'description' => $description,
                    'company'     => $company,
                    'location'    => $location,
                ];

                $response = $this->postJson('/api/vacancies', $payload);
                $response->assertStatus(201);

                $ids[] = $response->json('id');
            }

            $this->assertCount($n, array_unique($ids), 'All created vacancy IDs must be unique');
        });
    }
}
