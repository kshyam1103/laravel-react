<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_user()
    {
        $user = User::factory()->create();

        $response = $this->put('/users/' . $user->id, [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }
}
