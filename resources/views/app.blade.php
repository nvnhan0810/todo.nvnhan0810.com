<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#171717">
        <meta name="application-name" content="{{ config('app.name', 'Todo') }}">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'Todo') }}">
        @php
            $seoAppName = (string) config('app.name', 'Todo');
            $seoAppUrl = rtrim((string) config('app.url'), '/');
            $seoTitle = $seoAppName.' — Plan & Act on One Screen';
            $seoDescription = 'All-in-one web workspace: Eisenhower Matrix + Pomodoro Timer. Install the PWA and get focus-session notifications.';
            $seoImage = $seoAppUrl.'/images/og-image.png';
        @endphp
        <title inertia>{{ $seoTitle }}</title>
        <meta name="description" content="{{ $seoDescription }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $seoAppName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoAppUrl }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        @routes
        @viteReactRefresh
        @vite(['resources/sass/app.scss', 'resources/ts/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
