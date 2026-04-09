<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchVacanciesTest extends TestCase
{
    use RefreshDatabase;

    private array $baseData = [
        'description' => 'Build and maintain APIs.',
        'company'     => 'Dicoding',
        'location'    => 'Bandung',
    ];

    public function test_search_by_title_returns_matching_vacancies(): void
    {
        Vacancy::create(array_merge($this->baseData, ['title' => 'Backend Engineer']));
        Vacancy::create(array_merge($this->baseData, ['title' => 'Frontend Engineer']));
        Vacancy::create(array_merge($this->baseData, ['title' => 'Product Manager']));

        $response = $this->getJson('/api/vacancies?title=engineer');

        $response->assertStatus(200)
            ->assertJsonCount(2);

        $titles = collect($response->json())->pluck('title')->all();
        $this->assertContains('Backend Engineer', $titles);
        $this->assertContains('Frontend Engineer', $titles);
        $this->assertNotContains('Product Manager', $titles);
    }

    public function test_search_is_case_insensitive(): void
    {
        Vacancy::create(array_merge($this->baseData, ['title' => 'Backend Engineer']));

        $response = $this->getJson('/api/vacancies?title=ENGINEER');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Backend Engineer']);
    }

    public function test_search_returns_empty_when_no_match(): void
    {
        Vacancy::create(array_merge($this->baseData, ['title' => 'Backend Engineer']));

        $response = $this->getJson('/api/vacancies?title=nonexistent');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }
}
