<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12 flex flex-row max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">    	
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
			<div class="w-full px-2">
				<div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
					{{-- Add isActive: --}}
					{{-- :active="request()->routeIs('routeAToB')" --}}
					<a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Route A-B</span>
					</a>
					<a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Search</span>
					</a>
					<a class="flex items-center w-full h-12 px-3 mt-2 hover:bg-gray-300 rounded" href="#">
						<span class="ml-2 text-sm font-medium">Insights</span>
					</a>
					<a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Docs</span>
					</a>
				</div>
				<div class="flex flex-col items-center w-full mt-2 border-t border-gray-300">
					<a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Products</span>
					</a>
					<a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Settings</span>
					</a>
					<a class="relative flex	 items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
						<span class="ml-2 text-sm font-medium">Messages</span>
					</a>
				</div>
			</div>
			<a class="flex items-center justify-center w-full h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
				<span class="ml-2 text-sm font-medium">Account</span>
			</a>
		</div>
	
        <div class="sm:px-6 lg:px-8" style="width: 100%;">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900" style="height: auto">
					{{-- Map canvas: --}}
                    <div id='map' class='map'>
						<div id='foldable' class='tt-overlay-panel -left-top -medium js-foldable'>
							<form id=form>
								<div id='startSearchBox' class='searchbox-container'>
									<div class='tt-icon tt-icon-size icon-spacing-right -start'></div>
								</div>
								<div id='finishSearchBox' class='searchbox-container'>
									<div class='tt-icon tt-icon-size icon-spacing-right -finish'></div>
								</div>
							</form>
						</div>
					</div>	
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
