<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function signup(SignupRequest $request): JsonResponse
    {
        $data = $request->validated();

        /** @var User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']), // Using Laravel's Hash facade
        ]);

        $tokenResult = $user->createToken('Laravel');
        $token = $tokenResult->accessToken; // Use accessToken for Passport

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->accessToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ], 204);
    }
}
