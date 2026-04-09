<?php

use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::apiResource('vacancies', VacancyController::class);
