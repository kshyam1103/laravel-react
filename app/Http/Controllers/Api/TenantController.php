<?php

namespace App\Http\Controllers\Api;

use Stancl\Tenancy\Contracts\TenantWithDatabase as TenantContract;
use Stancl\Tenancy\Database\Models\Tenant;
use Stancl\Tenancy\Events\TenantCreated;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Tenant::paginate(10)); // Paginate results
    }

    /**
     * Store a newly created resource in storage.
     */

     public function store(Request $request)
     {
         $tenantData = $request->validate([
             'name' => 'required|string|max:255',
             'email' => 'required|email|unique:tenants,email',
             'password' => 'required|string|min:6|confirmed',
             'domain' => 'required|string|unique:domains,domain',
         ]);
     
         try {
             DB::beginTransaction();
     
             \Log::info('Creating Tenant:', $tenantData);
     
             // Create tenant using the Stancl Tenancy system
             $tenant = Tenant::create([
                 'id' => Str::uuid(),
                 'name' => $tenantData['name'],
                 'email' => $tenantData['email'],
                 'password' => Hash::make($tenantData['password']),
             ]);
     
             // Create domain for the tenant
             $tenant->domains()->create([
                 'domain' => $tenantData['domain'] . '.' . config('app.domain'),
             ]);
     
             // ✅ Properly initialize the tenant database
             tenancy()->initialize($tenant);  // This ensures the database is set up
     
             // ✅ Fire the event, which triggers database creation
             event(new TenantCreated($tenant));
             \Log::info('TenantCreated event fired for tenant: ' . $tenant->id);
     
             DB::commit();
     
             return response()->json([
                 'message' => 'Tenant created successfully with its own database',
                 'tenant' => $tenant,
             ], 201);
         } catch (\Exception $e) {
             DB::rollBack();
             \Log::error('Tenant Creation Failed: ' . $e->getMessage());
     
             return response()->json([
                 'error' => 'Failed to create tenant',
                 'message' => $e->getMessage(),
             ], 500);
         }
     }
     
    /**
     * Display the specified resource.
     */
    public function show(Tenant $tenant)
    {
        return response()->json($tenant);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:tenants,email,' . $tenant->id,
            'password' => 'nullable|string|min:6|confirmed',
            'domain' => 'sometimes|string|unique:domains,domain', // Ensure domain is unique
        ]);

        try {
            DB::beginTransaction();

            if ($request->filled('password')) {
                $tenant->password = bcrypt($request->password);
            }

            $tenant->update($request->except('password', 'domain'));

            if ($request->filled('domain')) {
                $tenant->domain()->updateOrCreate(
                    ['tenant_id' => $tenant->id], // Condition to find existing record
                    ['domain' => $request->domain]
                );
            }
            

            DB::commit();

            return response()->json(['message' => 'Tenant updated successfully', 'tenant' => $tenant], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update tenant', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant)
{
    try {
        DB::beginTransaction();

        // Delete related domain(s) first
        $tenant->domains()->delete();
        $tenant->delete();
        DB::commit();

        return response()->json(['message' => 'Tenant deleted successfully'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to delete tenant', 'message' => $e->getMessage()], 500);
    }
}

}