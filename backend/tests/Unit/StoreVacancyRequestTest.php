<?php

namespace Tests\Unit;

use App\Http\Requests\StoreVacancyRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreVacancyRequestTest extends TestCase
{
    private function rules(): array
    {
        return (new StoreVacancyRequest())->rules();
    }

    private function validate(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, $this->rules());
    }

    // --- Valid payloads ---

    public function test_valid_payload_passes_validation(): void
    {
        $validator = $this->validate([
            'title'       => 'Backend Engineer',
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertFalse($validator->fails());
    }

    public function test_valid_payload_with_salary_range_passes_validation(): void
    {
        $validator = $this->validate([
            'title'        => 'Backend Engineer',
            'description'  => 'A great job.',
            'company'      => 'Acme Corp',
            'location'     => 'Remote',
            'salary_range' => '5,000,000 – 8,000,000 IDR',
        ]);

        $this->assertFalse($validator->fails());
    }

    public function test_salary_range_is_optional(): void
    {
        $validator = $this->validate([
            'title'       => 'Backend Engineer',
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertFalse($validator->fails());
        $this->assertArrayNotHasKey('salary_range', $validator->errors()->toArray());
    }

    public function test_title_at_max_length_passes_validation(): void
    {
        $validator = $this->validate([
            'title'       => str_repeat('a', 255),
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertFalse($validator->fails());
    }

    // --- Missing required fields ---

    public function test_missing_title_fails_validation(): void
    {
        $validator = $this->validate([
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    public function test_missing_description_fails_validation(): void
    {
        $validator = $this->validate([
            'title'    => 'Backend Engineer',
            'company'  => 'Acme Corp',
            'location' => 'Remote',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
    }

    public function test_missing_company_fails_validation(): void
    {
        $validator = $this->validate([
            'title'       => 'Backend Engineer',
            'description' => 'A great job.',
            'location'    => 'Remote',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('company', $validator->errors()->toArray());
    }

    public function test_missing_location_fails_validation(): void
    {
        $validator = $this->validate([
            'title'       => 'Backend Engineer',
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('location', $validator->errors()->toArray());
    }

    // --- Field constraint violations ---

    public function test_title_too_long_fails_validation(): void
    {
        $validator = $this->validate([
            'title'       => str_repeat('a', 256),
            'description' => 'A great job.',
            'company'     => 'Acme Corp',
            'location'    => 'Remote',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }
}
