<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_existing_vacancy_returns_200_with_correct_body(): void
    {
        $vacancy = Vacancy::create([
            'title'       => 'Backend Engineer',
            'description' => 'Build APIs',
            'company'     => 'Dicoding',
            'location'    => 'Bandung',
            'salary_range' => '5,000,000 – 8,000,000 IDR',
        ]);

        $response = $this->getJson("/api/vacancies/{$vacancy->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id'          => $vacancy->id,
                'title'       => 'Backend Engineer',
                'description' => 'Build APIs',
                'company'     => 'Dicoding',
                'location'    => 'Bandung',
                'salary_range' => '5,000,000 – 8,000,000 IDR',
            ]);
    }

    public function test_get_non_existent_vacancy_returns_404(): void
    {
        $response = $this->getJson('/api/vacancies/99999');

        $response->assertStatus(404)
            ->assertJson(['message' => 'Vacancy not found.']);
    }
}
