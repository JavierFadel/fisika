@push('top-script')
    <link
        rel="stylesheet"
        type="text/css"
        href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css"
    />

    @vite(['resources/css/index.css', 'resources/css/app.css', 'resources/js/avoid.js', 'resources/css/poi.css'])
@endpush

<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Maps') }}
        </h2>
    </x-slot>

    <div class="flex flex-row max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">    	
		{{-- Sidebar: --}}
		<div class="flex flex-col items-center w-40 h-full overflow-hidden text-gray-700 bg-white rounded">
			<a class="flex items-center w-full px-3 mt-3" href="#">
				<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 -0.28 46.384 46.384" class="mx-2 w-4 h-4 fill-current">
					<g id="Group_47" data-name="Group 47" transform="translate(-369.028 -1786.405)">
					  <path id="Path_126" data-name="Path 126" d="M384.789,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
					  <path id="Path_127" data-name="Path 127" d="M413.412,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
					  <path id="Path_128" data-name="Path 128" d="M385.34,1824.733l13.761,5.5v-36.329l-13.761-5.5Z" fill="#d1d3d4" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
					</g>
				</svg>
				<span class="ml-2 text-sm font-bold">Features</span>
			</a>

            {{-- Main menu: --}}
			<div class="w-full px-2">
				<div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
					{{-- Add isActive: --}}
                    {{-- Make the routes something like: /maps/route, /maps/traffic --}}
                    <x-side-bar-link :href="route('maps')" :active="request()->routeIs('maps')">
                        {{ __('Route A-B') }}
                    </x-side-bar-link>
                    <x-side-bar-link :href="route('traffic')" :active="request()->routeIs('traffic')">
                        {{ __('Traffic Overview') }}
                    </x-side-bar-link>
                    <x-side-bar-link :href="route('instruction')" :active="request()->routeIs('instruction')">
                        {{ __('Routing with Instruction') }}
                    </x-side-bar-link>
                    <x-side-bar-link :href="route('avoid')" :active="request()->routeIs('avoid')">
                        {{ __('Avoid') }}
                    </x-side-bar-link>
				</div>
			</div>
		</div>
	
		{{-- Map container: --}}
        <div class="sm:px-6 lg:px-8" style="width: 100%;">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900" style="height: auto">
					{{-- Map canvas: --}}
                    <div id='map' class='full-map avoid-wrapper'>
                        <div class='tt-overlay-panel -left-top -medium js-foldable'>
                            <div class='header'>
                                Avoid
                            </div>
                            <div class='tt-form'>
                                <div class='tt-checkable-input'>
                                    <input id='tollRoads' class='tt-checkbox' type='checkbox' checked>
                                    <label for='tollRoads' class='tt-label -full'>Toll Roads</label>
                                </div>
                                <div class='tt-checkable-input'>
                                    <input id='motorways' class='tt-checkbox' type='checkbox' checked>
                                    <label for='motorways' class='tt-label -full'>Motorways</label>
                                </div>
                                <div class='tt-checkable-input'>
                                    <input id='ferries' class='tt-checkbox' type='checkbox' checked>
                                    <label for='ferries' class='tt-label -full'>Ferries</label>
                                </div>
                                <div class='tt-checkable-input'>
                                    <input id='unpavedRoads' class='tt-checkbox' type='checkbox' checked>
                                    <label for='unpavedRoads' class='tt-label -full'>Unpaved Roads</label>
                                </div>
                                <div class='tt-checkable-input'>
                                    <input id='carpools' class='tt-checkbox' type='checkbox' checked>
                                    <label for='carpools' class='tt-label -full'>Carpools</label>
                                </div>
                                <div class='tt-checkable-input'>
                                    <input id='alreadyUsedRoads' class='tt-checkbox' type='checkbox' checked>
                                    <label for='alreadyUsedRoads' class='tt-label -full'>Already Used Roads</label>
                                </div>
                            </div>
                            <div class='summary'>
                                <div class='summary-details'>
                                    Travel distance: <span class='distance-value'></span>
                                </div>
                                <div class='summary-details'>
                                    Travel time: <span class='time-value'></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>