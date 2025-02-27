<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\TenantController;  // Ensure correct namespace
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);
Route::get('/reset-password', [ForgotPasswordController::class, 'validateResetToken']);

// CSRF Protection Route
Route::post('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});


// Protected Routes (Authentication Required)
Route::middleware('auth:api')->group(function () {  // Change auth:api to auth:sanctum if using Sanctum
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/tenants', TenantController::class); 
});