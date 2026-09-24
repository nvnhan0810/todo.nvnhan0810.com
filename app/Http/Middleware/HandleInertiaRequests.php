<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;
use Throwable;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'avatar' => $request->user()->avatar,
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'created_project' => fn () => $request->session()->get('created_project'),
            ],
            'locale' => Inertia::always(fn () => app()->getLocale()),
            'translations' => Inertia::always(fn () => $this->loadTranslations(app()->getLocale())),
            'appName' => Inertia::always(fn () => (string) config('app.name')),
            'appUrl' => Inertia::always(fn () => rtrim((string) config('app.url'), '/')),
            'googleAnalyticsId' => Inertia::always(function (): ?string {
                $measurementId = config('services.google_analytics.measurement_id');

                if (! config('services.google_analytics.enabled') || ! filled($measurementId)) {
                    return null;
                }

                return is_string($measurementId) ? $measurementId : null;
            }),
            'webPush' => fn () => $request->user()
                ? [
                    'configured' => filled(config('web-push.vapid.public_key'))
                        && filled(config('web-push.vapid.private_key')),
                    'publicKey' => config('web-push.vapid.public_key'),
                ]
                : null,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function loadTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        if (! is_file($path)) {
            return [];
        }

        try {
            /** @var array<string, string>|null $decoded */
            $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            return [];
        }

        return is_array($decoded) ? $decoded : [];
    }
}
