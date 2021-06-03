/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* eslint-disable max-len */

( function() {
	const LOCAL_STORAGE_KEY = 'CKEDITOR_CS_CONFIG';

	function createDialog() {
		const overlay = document.createElement( 'div' );

		overlay.id = 'overlay';
		overlay.innerHTML = `
			<form class="body">
				<h2>Connect CKEditor Cloud Services</h2>
				<p>If you do not have Cloud Services URLs yet, <a href="https://ckeditor.com/docs/cs/latest/guides/collaboration/quick-start.html" target="_blank">see the documentation</a>.</p>
				<div><label for="upload-url">Upload URL</label><input id="upload-url"></div>
				<div><label for="web-socket-url">WebSocket URL</label><input id="web-socket-url"></div>
				<div><label for="token-url">Token URL</label><input required id="token-url"></div>
				<div id="additional">
					<p>Use one of the following users to define the user data.</p>
					<div id="user-container"></div>
				</div>
				<div><label for="channel-id">Channel ID</label><input required id="channel-id"></div>
				<button type="submit" id="start">Start</button>
			</form>`;

		document.body.appendChild( overlay );

		const form = overlay.querySelector( 'form' );
		const tokenUrlInput = document.getElementById( 'token-url' );
		const uploadUrlInput = document.getElementById( 'upload-url' );
		const webSocketUrlInput = document.getElementById( 'web-socket-url' );
		const channelIdInput = document.getElementById( 'channel-id' );
		const additional = document.getElementById( 'additional' );
		const userContainer = document.getElementById( 'user-container' );

		const csConfig = getStoredConfig();

		tokenUrlInput.value = csConfig.tokenUrl || '';
		uploadUrlInput.value = csConfig.uploadUrl || '';
		webSocketUrlInput.value = csConfig.webSocketUrl || '';
		channelIdInput.value = handleDocIdInUrl();

		// Create two random users with avatars.
		addUser( {
			id: 'e1',
			name: 'Tom Rowling',
			avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
			role: 'writer'
		} );

		addUser( {
			id: 'e2',
			name: 'Wei Hong',
			avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
			role: 'writer'
		} );

		// Create two random users without avatars.
		addUser( { id: 'e3', name: 'Rani Patel', role: 'writer' } );
		addUser( { id: 'e4', name: 'Henrik Jensen', role: 'commentator' } );

		// Create two anonymous users.
		addUser( { id: randomString(), role: 'writer' } );
		addUser( { id: randomString(), role: 'reader' } );

		tokenUrlInput.addEventListener( 'input', () => {
			overlay.classList.remove( 'warning' );
			userContainer.querySelectorAll( 'div' ).forEach( div => div.classList.remove( 'active' ) );
			additional.classList.toggle( 'visible', isCloudServicesTokenEndpoint( tokenUrlInput.value ) );
		} );

		// Mark the first user as selected.
		if ( isCloudServicesTokenEndpoint( csConfig.tokenUrl ) ) {
			additional.classList.add( 'visible' );
		}

		return new Promise( resolve => {
			form.addEventListener( 'submit', evt => {
				evt.preventDefault();

				// Detect if the token contains user data.
				if ( isCloudServicesTokenEndpoint( tokenUrlInput.value ) && !tokenUrlInput.value.includes( '?' ) ) {
					overlay.classList.add( 'warning' );

					return;
				}

				storeConfig( {
					tokenUrl: getRawTokenUrl( tokenUrlInput.value ),
					uploadUrl: uploadUrlInput.value,
					webSocketUrl: webSocketUrlInput.value,
				} );

				updateDocIdInUrl( channelIdInput.value );

				overlay.remove();

				resolve( {
					tokenUrl: tokenUrlInput.value,
					uploadUrl: uploadUrlInput.value,
					webSocketUrl: webSocketUrlInput.value,
					channelId: channelIdInput.value
				} );
			} );
		} );
	}

	function addUser( options ) {
		const userContainer = document.getElementById( 'user-container' );
		const tokenUrlInput = document.getElementById( 'token-url' );
		const overlayEl = document.getElementById( 'overlay' );

		const userDiv = document.createElement( 'div' );
		userDiv.innerText = options.name || '(anonymous)';

		const userRoleSpan = document.createElement( 'span' );
		userRoleSpan.innerText = options.role;
		userRoleSpan.classList.add( 'role' );
		userDiv.appendChild( userRoleSpan );

		if ( options.avatar ) {
			const img = document.createElement( 'img' );

			img.src = options.avatar;
			userDiv.prepend( img );
		} else {
			// Handle cases without avatar to display them properly in the users list.
			const pseudoAvatar = document.createElement( 'span' );
			pseudoAvatar.classList.add( 'pseudo-avatar' );

			if ( !options.name ) {
				pseudoAvatar.classList.add( 'anonymous' );
			} else {
				pseudoAvatar.textContent = getUserInitials( options.name );
			}

			userDiv.prepend( pseudoAvatar );
		}

		userDiv.addEventListener( 'click', () => {
			tokenUrlInput.value = `${ getRawTokenUrl( tokenUrlInput.value ) }?` + Object.keys( options )
				.filter( key => options[ key ] )
				.map( key => {
					if ( key === 'role' ) {
						return `${ key }=${ options[ key ] }`;
					}

					return `user.${ key }=${ options[ key ] }`;
				} )
				.join( '&' );

			overlayEl.classList.remove( 'warning' );
			userContainer.querySelectorAll( 'div' ).forEach( div => div.classList.remove( 'active' ) );
			userDiv.classList.add( 'active' );
		} );

		userContainer.appendChild( userDiv );
	}

	function handleDocIdInUrl() {
		let id = getDocIdFromUrl();

		if ( !id ) {
			id = randomString();
			updateDocIdInUrl( id );
		}

		return id;
	}

	function getUserInitials( name ) {
		return name.split( ' ', 2 ).map( part => part.charAt( 0 ) ).join( '' ).toUpperCase();
	}

	function updateDocIdInUrl( id ) {
		window.history.replaceState( {}, document.title, generateUrlWithDocId( id ) );
	}

	function generateUrlWithDocId( id ) {
		return `${ window.location.href.split( '?' )[ 0 ] }?docId=${ id }`;
	}

	function getDocIdFromUrl() {
		const docIdMatch = location.search.match( /docId=(.+)$/ );

		return docIdMatch ? decodeURIComponent( docIdMatch[ 1 ] ) : null;
	}

	function getStoredConfig() {
		return JSON.parse( localStorage.getItem( LOCAL_STORAGE_KEY ) || '{}' );
	}

	function storeConfig( csConfig ) {
		localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( csConfig ) );
	}

	function isCloudServicesTokenEndpoint( tokenUrl ) {
		return /cke-cs[\w-]*\.com\/token\/dev/.test( tokenUrl );
	}

	function getRawTokenUrl( url ) {
		if ( isCloudServicesTokenEndpoint( url ) ) {
			return url.split( '?' )[ 0 ];
		}

		return url;
	}

	function randomString() {
		return Math.floor( Math.random() * Math.pow( 2, 52 ) ).toString( 32 );
	}

	window.createDialog = createDialog;
}() );
