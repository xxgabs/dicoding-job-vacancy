<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'company'      => ['required', 'string'],
            'location'     => ['required', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
        ];
    }
}
