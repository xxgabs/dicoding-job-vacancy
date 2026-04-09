<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => ['sometimes', 'string', 'max:255'],
            'description'  => ['sometimes', 'string'],
            'company'      => ['sometimes', 'string'],
            'location'     => ['sometimes', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
        ];
    }
}
