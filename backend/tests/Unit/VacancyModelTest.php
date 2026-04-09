<?php

namespace Tests\Unit;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_fillable_fields_are_correct(): void
    {
        $vacancy = new Vacancy();

        $this->assertSame(
            ['title', 'description', 'company', 'location', 'salary_range'],
            $vacancy->getFillable()
        );
    }

    public function test_salary_range_defaults_to_null(): void
    {
        $vacancy = Vacancy::create([
            'title'       => 'Software Engineer',
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertNull($vacancy->salary_range);
    }

    public function test_scope_by_title_filters_by_title(): void
    {
        Vacancy::create(['title' => 'Backend Engineer',  'description' => 'desc', 'company' => 'A', 'location' => 'X']);
        Vacancy::create(['title' => 'Frontend Developer', 'description' => 'desc', 'company' => 'B', 'location' => 'Y']);
        Vacancy::create(['title' => 'DevOps Specialist',  'description' => 'desc', 'company' => 'C', 'location' => 'Z']);

        $results = Vacancy::byTitle('Engineer')->get();

        $this->assertCount(1, $results);
        $this->assertSame('Backend Engineer', $results->first()->title);
    }

    public function test_scope_by_title_is_case_insensitive(): void
    {
        Vacancy::create(['title' => 'Backend Engineer', 'description' => 'desc', 'company' => 'A', 'location' => 'X']);

        $results = Vacancy::byTitle('ENGINEER')->get();

        $this->assertCount(1, $results);
        $this->assertSame('Backend Engineer', $results->first()->title);
    }

    public function test_scope_by_title_returns_empty_when_no_match(): void
    {
        Vacancy::create(['title' => 'Backend Engineer', 'description' => 'desc', 'company' => 'A', 'location' => 'X']);

        $results = Vacancy::byTitle('nonexistent')->get();

        $this->assertCount(0, $results);
    }
}
