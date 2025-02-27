<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_delete_user()
    {
        $user = User::factory()->create();

        $response = $this->delete('/users/' . $user->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}
