<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @stack('top-script')
    </head>
    <body class="font-sans antialiased">

        @stack('body-script')

        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>

        <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps-web.min.js'></script>
        <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/services/services-web.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js'></script>

        <script type='text/javascript' src='{{ Vite::asset('resources/js/mobile-or-tablet.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/info-hint.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/searchbox-enter-submit.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/foldable.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/dom-helpers.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/formatters.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/results-manager.js') }}'></script>
        <script type='text/javascript' src='{{ Vite::asset('resources/js/guidance-panel.js') }}'></script>

        @stack('bottom-script')
    </body>
</html>
