<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVacancyRequest;
use App\Http\Requests\UpdateVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $vacancies = Vacancy::query()
            ->when($request->title, fn($q, $t) => $q->byTitle($t))
            ->get();

        return response()->json($vacancies);
    }

    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $vacancy = Vacancy::create($request->validated());
        return response()->json($vacancy, 201);
    }

    public function show(int $id): JsonResponse
    {
        $vacancy = Vacancy::findOrFail($id);
        return response()->json($vacancy);
    }

    public function update(UpdateVacancyRequest $request, int $id): JsonResponse
    {
        $vacancy = Vacancy::findOrFail($id);
        $vacancy->update($request->validated());
        return response()->json($vacancy);
    }

    public function destroy(int $id): \Illuminate\Http\Response
    {
        $vacancy = Vacancy::findOrFail($id);
        $vacancy->delete();
        return response()->noContent();
    }
}
