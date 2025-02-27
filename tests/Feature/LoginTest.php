<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class LoginTest extends TestCase
{
    use RefreshDatabase; // Resets the database after each test

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        // Create a user in the database
        $user = User::factory()->create();

        // Send a POST request to login endpoint
        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Check if login was successful
        $this->assertAuthenticated();
                 
    }
}