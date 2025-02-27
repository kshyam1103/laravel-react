<?php

namespace App\Providers;

use Stancl\Tenancy\Bootstraps\DatabaseTenancyBootstrapper;
use Stancl\Tenancy\Tenancy;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //Schema::defaultStringLength(191);

        // // Correct way to register tenant-specific migrations
        // Tenancy::macro('runTenantMigrations', function () {
        //     \Illuminate\Support\Facades\Artisan::call('migrate', [
        //         '--path' => 'database/migrations/tenant',
        //         '--force' => true,
        //     ]);
        // });
    }
}
