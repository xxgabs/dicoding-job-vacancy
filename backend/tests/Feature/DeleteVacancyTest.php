<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteVacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_delete_existing_vacancy_returns_204(): void
    {
        $vacancy = Vacancy::create([
            'title' => 'Backend Engineer',
            'description' => 'Build APIs',
            'company' => 'Dicoding',
            'location' => 'Bandung',
        ]);

        $response = $this->deleteJson("/api/vacancies/{$vacancy->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('vacancies', ['id' => $vacancy->id]);
    }

    public function test_delete_non_existent_vacancy_returns_404(): void
    {
        $response = $this->deleteJson('/api/vacancies/99999');

        $response->assertStatus(404);
    }
}
