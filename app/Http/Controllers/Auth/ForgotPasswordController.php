<?php 

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    // Handle sending reset link email
    public function sendResetLinkEmail(Request $request)
    {
        // Validate the email field
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email', // Validate email and check if exists
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Attempt to send password reset link (using Laravel's built-in functionality)
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent successfully']);
        }

        return response()->json(['message' => 'Failed to send reset link'], 500);
    }

    // Handle password reset
    public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
        'token' => 'required',
        'password' => 'required|min:6|confirmed',
    ]);
    
    \Log::info('Before Password Reset:', ['password' => $request->password]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            \Log::info('Inside Closure:', ['password' => $password]); // Log the password received

            $user->forceFill([
                'password' => Hash::make($password),  // Hashing the correct password
                'remember_token' => null
            ])->save();
        }
    );

    \Log::info('After Password Reset:', ['status' => $status]);

    if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => 'Password reset successfully.']);
    } else {
        return response()->json(['errors' => ['email' => 'Invalid token or email.']], 422);
    }
}

    public function validateResetToken(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
        'token' => 'required',
    ]);

    $status = Password::tokenExists(
        \App\Models\User::where('email', $request->email)->first(),
        $request->token
    );

    if ($status) {
        return response()->json(['message' => 'Valid token.']);
    }

    return response()->json(['errors' => ['token' => 'Invalid or expired token.']], 422);
}

}
