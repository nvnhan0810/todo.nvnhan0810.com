<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLocaleRequest;
use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    public function update(UpdateLocaleRequest $request): RedirectResponse
    {
        $locale = $request->string('locale')->toString();

        $request->session()->put('locale', $locale);
        app()->setLocale($locale);

        return back();
    }
}
