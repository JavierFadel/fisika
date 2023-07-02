@props(['active'])

@php
$classes = ($active ?? false)
            ? 'flex items-center w-full h-12 px-3 mt-2 rounded bg-gray-200'
            : 'flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-200'
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>