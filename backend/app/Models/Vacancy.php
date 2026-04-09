<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $fillable = [
        'title',
        'description',
        'company',
        'location',
        'salary_range',
    ];

    protected $attributes = [
        'salary_range' => null,
    ];

    public function scopeByTitle($query, string $title)
    {
        return $query->where('title', 'LIKE', '%' . $title . '%');
    }
}
