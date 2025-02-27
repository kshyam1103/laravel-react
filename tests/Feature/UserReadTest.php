<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserReadTest extends TestCase
{
    use RefreshDatabase;

    public function test_read_user()
    {
        $user = User::factory()->create();

        $response = $this->get('/users/' . $user->id);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}
