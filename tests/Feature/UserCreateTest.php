<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_user()
    {
        // Prepare the data to be sent in the POST request
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',  // Make sure this matches the validation rules
            'password_confirmation' => 'password123',  // Add confirmation field if needed
        ];

        // Send a POST request to create the user
        $response = $this->post('/users', $userData);

        // Assert that the response status is 201 (created)
        $response->assertStatus(201);

        // Assert that the user was created in the database
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);

        // Optionally, check if the password is hashed
        $user = User::where('email', 'john@example.com')->first();
        $this->assertTrue(Hash::check('password123', $user->password));  // Verifies the password hash
    }
}
