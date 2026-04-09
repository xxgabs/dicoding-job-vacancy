<?php

// Feature: job-vacancy-system, Property 6: Search filter correctness

namespace Tests\Feature\Property;

use App\Models\Vacancy;
use Eris\Generators;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Validates: Requirements 3.1, 3.2
 */
class SearchFilterPropertyTest extends TestCase
{
    use RefreshDatabase;
    use TestTrait;

    /**
     * Property 6: Search filter correctness.
     *
     * For any non-empty search term and any set of vacancies, a GET to
     * /api/vacancies?title={term} must return HTTP 200 and only vacancies
     * whose titles contain the search term (case-insensitive). Vacancies
     * whose titles do not contain the term must not appear in the response.
     *
     * Validates: Requirements 3.1, 3.2
     */
    public function test_search_filter_returns_only_matching_vacancies(): void
    {
        // Generate a short non-empty search term (used as a unique substring)
        $searchTermGen = Generators::map(
            fn (string $name) => 'term_' . $name,
            Generators::names()
        );

        // Non-empty string for other fields
        $nonEmptyStringGen = Generators::map(
            fn (string $name) => 'x' . $name,
            Generators::names()
        );

        // Number of matching vacancies (1–3)
        $matchCountGen = Generators::choose(1, 3);

        // Number of non-matching vacancies (1–3)
        $nonMatchCountGen = Generators::choose(1, 3);

        $this->forAll(
            $searchTermGen,
            $matchCountGen,
            $nonMatchCountGen,
            $nonEmptyStringGen, // description
            $nonEmptyStringGen, // company
            $nonEmptyStringGen  // location
        )
        ->withMaxSize(100)
        ->then(function (
            string $searchTerm,
            int $matchCount,
            int $nonMatchCount,
            string $description,
            string $company,
            string $location
        ) {
            // Clear vacancies between iterations
            Vacancy::query()->delete();

            // Create matching vacancies: titles CONTAIN the search term
            $matchingTitles = [];
            for ($i = 0; $i < $matchCount; $i++) {
                $title = 'prefix_' . $searchTerm . '_suffix_' . $i;
                $matchingTitles[] = $title;
                Vacancy::create([
                    'title'       => $title,
                    'description' => $description,
                    'company'     => $company,
                    'location'    => $location,
                ]);
            }

            // Create non-matching vacancies: titles do NOT contain the search term
            // Use a title that is guaranteed not to contain the search term
            $nonMatchingTitles = [];
            for ($i = 0; $i < $nonMatchCount; $i++) {
                $title = 'nomatch_vacancy_' . $i . '_' . md5($searchTerm . $i);
                $nonMatchingTitles[] = $title;
                Vacancy::create([
                    'title'       => $title,
                    'description' => $description,
                    'company'     => $company,
                    'location'    => $location,
                ]);
            }

            // GET /api/vacancies?title={searchTerm}
            $response = $this->getJson('/api/vacancies?title=' . urlencode($searchTerm));

            $response->assertStatus(200);

            $results = $response->json();

            // Assert: all returned titles contain the search term (case-insensitive)
            foreach ($results as $vacancy) {
                $this->assertStringContainsStringIgnoringCase(
                    $searchTerm,
                    $vacancy['title'],
                    "Returned vacancy title '{$vacancy['title']}' does not contain search term '{$searchTerm}'"
                );
            }

            // Assert: all matching vacancies ARE in the response
            $returnedTitles = array_column($results, 'title');
            foreach ($matchingTitles as $matchingTitle) {
                $this->assertContains(
                    $matchingTitle,
                    $returnedTitles,
                    "Matching vacancy '{$matchingTitle}' was not returned for search term '{$searchTerm}'"
                );
            }

            // Assert: non-matching vacancies are NOT in the response
            foreach ($nonMatchingTitles as $nonMatchingTitle) {
                $this->assertNotContains(
                    $nonMatchingTitle,
                    $returnedTitles,
                    "Non-matching vacancy '{$nonMatchingTitle}' should not appear for search term '{$searchTerm}'"
                );
            }
        });
    }
}
