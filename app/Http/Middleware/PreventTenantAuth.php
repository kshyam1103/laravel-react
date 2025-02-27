<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventTenantAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        console.log('Middleware is running!', $request->path());

        if (tenancy()->initialized) {  // Ensure tenancy is detected
            if (str_contains($request->path(), 'login') || str_contains($request->path(), 'signup')) {
                return response()->json(['error' => 'Unauthorized in tenant domain'], 403);
            }
        }

        return $next($request);
    }
}
