<?php

namespace App\Providers;

use App\Http\Controllers\Api\AuthController;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;


class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot(): void
    {
        $centralDomains = $this->centralDomains();
    
        $this->routes(function () use ($centralDomains) {
            // Routes for central domains
            foreach ($centralDomains as $domain) {
                Route::middleware('api')
                    ->prefix('api')
                    ->domain($domain)
                    ->group(base_path('routes/api.php'));
            }
    
            // Routes for tenants
            Route::middleware('api')
                ->domain('{tenant}.localhost')
                ->group(base_path('routes/tenant.php'));
        });
    }
    

    /**
     * Configure the rate limiters for the application.
     *
     * @return array
     */
    public function centralDomains(): array
    {
        return config('tenancy.central_domains') ?? [];
    }
}
