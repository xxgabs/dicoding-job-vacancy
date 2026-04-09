<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateVacancyTest extends TestCase
{
    use RefreshDatabase;

    private array $validPayload = [
        'title'       => 'Backend Engineer',
        'description' => 'Build and maintain APIs.',
        'company'     => 'Dicoding',
        'location'    => 'Bandung',
    ];

    private function createVacancy(array $overrides = []): Vacancy
    {
        return Vacancy::create(array_merge($this->validPayload, $overrides));
    }

    public function test_can_update_vacancy_with_valid_data(): void
    {
        $vacancy = $this->createVacancy();

        $updatePayload = [
            'title'       => 'Senior Backend Engineer',
            'description' => 'Lead API development.',
            'company'     => 'Dicoding',
            'location'    => 'Remote',
        ];

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", $updatePayload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title'       => 'Senior Backend Engineer',
                'description' => 'Lead API development.',
                'location'    => 'Remote',
            ]);
    }

    public function test_update_non_existent_vacancy_returns_404(): void
    {
        $response = $this->putJson('/api/vacancies/99999', $this->validPayload);

        $response->assertStatus(404);
    }

    public function test_update_vacancy_fails_with_title_too_long(): void
    {
        $vacancy = $this->createVacancy();

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", [
            'title' => str_repeat('a', 256),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_can_partially_update_vacancy(): void
    {
        $vacancy = $this->createVacancy();

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Updated Title'])
            ->assertJsonFragment([
                'description' => $this->validPayload['description'],
                'company'     => $this->validPayload['company'],
                'location'    => $this->validPayload['location'],
            ]);
    }

    public function test_can_update_vacancy_with_patch(): void
    {
        $vacancy = $this->createVacancy();

        $response = $this->patchJson("/api/vacancies/{$vacancy->id}", [
            'title'    => 'Patched Title',
            'location' => 'Jakarta',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title'    => 'Patched Title',
                'location' => 'Jakarta',
            ]);
    }

    public function test_update_persists_changes_to_database(): void
    {
        $vacancy = $this->createVacancy();

        $this->putJson("/api/vacancies/{$vacancy->id}", [
            'title'    => 'Persisted Title',
            'location' => 'Surabaya',
        ]);

        $this->assertDatabaseHas('vacancies', [
            'id'       => $vacancy->id,
            'title'    => 'Persisted Title',
            'location' => 'Surabaya',
        ]);
    }

    public function test_update_response_contains_expected_structure(): void
    {
        $vacancy = $this->createVacancy();

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", [
            'title' => 'Structured Title',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'title', 'description', 'company', 'location', 'salary_range']);
    }

    public function test_update_vacancy_fails_with_salary_range_too_long(): void
    {
        $vacancy = $this->createVacancy();

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", [
            'salary_range' => str_repeat('a', 101),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['salary_range']);
    }
}
