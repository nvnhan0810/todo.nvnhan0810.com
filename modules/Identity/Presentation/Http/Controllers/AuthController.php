<?php

namespace Modules\Identity\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use Modules\Identity\Application\Query\IsEmailAllowed;
use Modules\Identity\Domain\Ports\IndexSsoClient;
use Modules\Shared\Application\QueryBus;

class AuthController extends Controller
{
    public function __construct(
        private readonly QueryBus $queries,
        private readonly IndexSsoClient $sso,
    ) {}

    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('matrix.index');
        }

        return Inertia::render('presentation/pages/auth/LoginPage');
    }

    public function redirectSso(): RedirectResponse
    {
        return redirect()->away($this->sso->authorizeUrl());
    }

    public function callbackSso(Request $request): RedirectResponse
    {
        $state = (string) $request->query('state', '');
        $code = (string) $request->query('code', '');

        if ($code === '' || ! $this->sso->validateState($state)) {
            return redirect()->route('login')
                ->with('error', 'Phiên đăng nhập SSO không hợp lệ.');
        }

        try {
            $claims = $this->sso->exchangeAuthorizationCode($code);
        } catch (\Throwable) {
            return redirect()->route('login')
                ->with('error', 'Đăng nhập SSO thất bại.');
        }

        $email = $claims['email'];

        if (! $this->queries->ask(new IsEmailAllowed($email))) {
            return redirect()->route('login')
                ->with('error', 'Email này chưa được cấp quyền. Liên hệ admin để thêm vào allowlist.');
        }

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $claims['name'] !== '' ? $claims['name'] : Str::before($email, '@'),
                'avatar' => $claims['avatar'],
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(64)),
            ],
        );

        Auth::login($user, remember: true);

        return redirect()->intended(route('matrix.index'));
    }

    public function redirectGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callbackGoogle(): RedirectResponse
    {
        try {
            $ggUser = Socialite::driver('google')->user();
        } catch (\Throwable) {
            return redirect()->route('login')
                ->with('error', 'Đăng nhập Google thất bại.');
        }

        $email = strtolower(trim((string) $ggUser->getEmail()));

        if ($email === '' || ! $this->queries->ask(new IsEmailAllowed($email))) {
            return redirect()->route('login')
                ->with('error', 'Email này chưa được cấp quyền. Liên hệ admin để thêm vào allowlist.');
        }

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $ggUser->getName() ?: Str::before($email, '@'),
                'avatar' => $ggUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(64)),
            ],
        );

        Auth::login($user, remember: true);

        return redirect()->intended(route('matrix.index'));
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Đã đăng xuất.');
    }
}
