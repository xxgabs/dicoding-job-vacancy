<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateVacancyTest extends TestCase
{
    use RefreshDatabase;

    private array $validPayload = [
        'title'       => 'Backend Engineer',
        'description' => 'Build and maintain APIs.',
        'company'     => 'Dicoding',
        'location'    => 'Bandung',
    ];

    public function test_can_create_vacancy_with_valid_data(): void
    {
        $response = $this->postJson('/api/vacancies', $this->validPayload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'title'       => 'Backend Engineer',
                'description' => 'Build and maintain APIs.',
                'company'     => 'Dicoding',
                'location'    => 'Bandung',
            ])
            ->assertJsonStructure(['id', 'title', 'description', 'company', 'location']);
    }

    public function test_create_vacancy_fails_with_missing_title(): void
    {
        $payload = $this->validPayload;
        unset($payload['title']);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_create_vacancy_fails_with_missing_description(): void
    {
        $payload = $this->validPayload;
        unset($payload['description']);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['description']);
    }

    public function test_create_vacancy_fails_with_missing_company(): void
    {
        $payload = $this->validPayload;
        unset($payload['company']);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['company']);
    }

    public function test_create_vacancy_fails_with_missing_location(): void
    {
        $payload = $this->validPayload;
        unset($payload['location']);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['location']);
    }

    public function test_create_vacancy_fails_with_title_too_long(): void
    {
        $payload = array_merge($this->validPayload, ['title' => str_repeat('a', 256)]);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_can_create_vacancy_with_optional_salary_range(): void
    {
        $payload = array_merge($this->validPayload, ['salary_range' => '5,000,000 – 8,000,000 IDR']);

        $response = $this->postJson('/api/vacancies', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['salary_range' => '5,000,000 – 8,000,000 IDR']);
    }

    public function test_can_create_vacancy_without_salary_range(): void
    {
        $response = $this->postJson('/api/vacancies', $this->validPayload);

        $response->assertStatus(201);
        $this->assertNull($response->json('salary_range'));
    }
}
