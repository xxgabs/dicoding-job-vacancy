<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListVacanciesTest extends TestCase
{
    use RefreshDatabase;

    private array $vacancyData = [
        'description' => 'Build and maintain APIs.',
        'company'     => 'Dicoding',
        'location'    => 'Bandung',
    ];

    public function test_list_returns_all_vacancies(): void
    {
        Vacancy::create(array_merge($this->vacancyData, ['title' => 'Backend Engineer']));
        Vacancy::create(array_merge($this->vacancyData, ['title' => 'Frontend Developer']));
        Vacancy::create(array_merge($this->vacancyData, ['title' => 'DevOps Engineer']));

        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_list_returns_empty_array_when_no_vacancies(): void
    {
        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_list_returns_correct_structure(): void
    {
        Vacancy::create(array_merge($this->vacancyData, [
            'title'       => 'Backend Engineer',
            'salary_range' => '5,000,000 – 8,000,000 IDR',
        ]));

        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'title', 'description', 'company', 'location', 'salary_range'],
            ]);
    }
}
